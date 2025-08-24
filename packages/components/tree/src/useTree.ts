import { computed, ref, watch, type SetupContext } from 'vue';
import {
    type TreeKey,
    type treeEmits,
    type TreeNode,
    type TreeOption,
    type TreeProps,
    type Tree
} from './tree';

export function useTree(
    props: TreeProps,
    emit: SetupContext<typeof treeEmits>['emit']
) {
    // 将 props.data 格式化后放到 tree 中
    const tree = ref<Tree>();
    // 半选的key
    const indeterminateRefs = ref<Set<TreeKey>>(new Set());
    // 需要展开的 key
    const expandedKeysSet = ref<Set<TreeKey>>();
    //正处于加载中的 key, 用于防止用户多次点击同一个 key
    const loadingKeysRef = ref(new Set<TreeKey>());
    // 复选框选中的key
    const checkedKeysRef = ref(new Set(props.defaultCheckedKeys));
    // 选中的key
    const selectKeysRef = ref<TreeKey[]>([]);
    const refsMap = {
        expand: expandedKeysSet,
        select: selectKeysRef,
        indeterminate: indeterminateRefs
    };
    /**
     *  根据 expandedKeySet 对树进行展开
     *  例如: expandedKeySet 是 40(代表需要将 key 为 40 的子树展开),
     *  - 40
     *      - 4010
     *      - 4020
     *      - 4030
     *          - 403010
     *          - 403020
     *  - 50
     *  展开结果如下:
     *  [40, 4010, 4020, 4030, 50]
     */
    const flattenTree = computed(() => {
        const expandedKeys = expandedKeysSet.value; // 所有要展开的 key
        const flattenNodes: TreeNode[] = []; // 拍平后的结果
        const nodes = tree.value?.treeNodes || []; // 被格式化后的节点

        const stack: TreeNode[] = []; // 用于遍历树的栈
        // 将 nodes 倒序插入到栈中(因为最外层的节点肯定是拍平的)
        for (let i = nodes.length - 1; i >= 0; i--) {
            stack.push(nodes[i]);
        }

        // 深度遍历栈, 将所有需要展开的 key 全部展开
        while (stack.length) {
            const node = stack.pop();
            if (!node) continue;
            flattenNodes.push(node);

            if (expandedKeys?.has(treeOptions.getKey(node))) {
                const children = node.children;
                if (children) {
                    for (let i = children.length - 1; i >= 0; i--) {
                        stack.push(children[i]);
                    }
                }
            }
        }

        return flattenNodes;
    });

    function createOptions(key: string, label: string, children: string) {
        return {
            getKey(node: TreeOption) {
                return node[key] as string; // 用户传递的 key
            },
            getLabel(node: TreeOption) {
                return node[label] as string; // 用户传递的 label
            },
            getChildren(node: TreeOption) {
                return node[children] as TreeOption[]; // 用户传递的 children 获取孩子
            }
        };
    }

    const treeOptions = createOptions(
        props.keyField!,
        props.labelField!,
        props.childrenField!
    );

    function createTree(
        data: TreeOption[],
        parent: TreeNode | null = null
    ): Tree {
        const treeNodeMap: Map<TreeKey, TreeNode> = new Map();
        function traversal(
            data: TreeOption[],
            parent: TreeNode | null = null
        ): TreeNode[] {
            return data.map((node: TreeOption) => {
                const children = treeOptions.getChildren(node) || [];
                const key = treeOptions.getKey(node);
                const treeNode: TreeNode = {
                    key: key,
                    label: treeOptions.getLabel(node),
                    children: [], // 默认为空
                    rawNode: node,
                    level: parent ? parent.level + 1 : 0,
                    disabled: !!node.disabled,
                    // 以 node 属性 isLeaf 为准，其次是判断孩子是否为空
                    // ?? 是对 || 的增强, 即只有 node.isLeaf 不存在的时候, 才会走到后面, 而不是为 false 时
                    isLeaf: node.isLeaf ?? children.length == 0,
                    parentKey: parent?.key
                };
                if (children.length > 0) {
                    // 有孩子则递归孩子，将孩子也格式化成 treeNode 类型
                    treeNode.children = traversal(children, treeNode);
                }
                treeNodeMap.set(key, treeNode);
                return treeNode;
            });
        }

        const treeNodes: TreeNode[] = traversal(data, parent);

        return { treeNodes, treeNodeMap };
    }

    /**
     * 从 flattenTree 中找到指定 key 的 node
     */
    function findNode(key: TreeKey) {
        return flattenTree.value.find(node => treeOptions.getKey(node) === key);
    }

    function isExpanded(node: TreeNode): boolean {
        return expandedKeysSet.value!.has(treeOptions.getKey(node));
    }

    /**
     * 折叠子树
     */
    function collapse(node: TreeNode) {
        expandedKeysSet.value!.delete(treeOptions.getKey(node));
    }

    /**
     * 触发 children 加载
     */
    function triggerLoading(node: TreeNode): Promise<void> {
        return new Promise((res, rej) => {
            // 不是叶子节点但孩子长度为 0, 则说明需要异步加载
            if (!node.children.length && !node.isLeaf) {
                const loadingKeys = loadingKeysRef.value;
                if (!loadingKeys.has(treeOptions.getKey(node))) {
                    loadingKeys.add(treeOptions.getKey(node));
                    const onLoad = props.load!;
                    onLoad(node.rawNode)
                        .then(childNode => {
                            if (childNode.length === 0) {
                                throw new Error();
                            } else {
                                // 修改节点的原始 children(即用户传入的 children)
                                node.rawNode.children = childNode;
                                // 对 children 进行规范化
                                const children = createTree(childNode, node);
                                node.children = children.treeNodes;
                                children.treeNodeMap.forEach((val, key) => {
                                    tree.value?.treeNodeMap.set(key, val);
                                });
                                updateCheckToBottom(node, isChecked(node));
                                emit('loaded', childNode);
                                res();
                            }
                        })
                        .catch(() => {
                            node.isLeaf = true;
                            rej();
                        })
                        .finally(() => {
                            loadingKeys.delete(treeOptions.getKey(node));
                        });
                }
            } else {
                res();
            }
        });
    }

    /**
     * 展开子树
     */
    async function expand(node: TreeNode) {
        // 触发懒加载
        if (props.load) {
            await triggerLoading(node); // 若状态为 reject，则后续不会操作 expandedKeySet
        }
        expandedKeysSet.value!.add(treeOptions.getKey(node));
    }

    /**
     * 切换展开状态
     */
    function toggleExpand(node: TreeNode) {
        const expandKeys = expandedKeysSet.value!;
        if (
            expandKeys.has(treeOptions.getKey(node)) &&
            !loadingKeysRef.value.has(treeOptions.getKey(node)) // 如果当前节点正处于加载中, 则不能收起
        ) {
            collapse(node);
            afterNodeExpand(node, false);
        } else {
            expand(node)
                .then(() => {
                    // 展开成功
                    afterNodeExpand(node, true);
                })
                .catch(() => {
                    //
                });
        }
    }

    function afterNodeExpand(node: TreeNode, expanded: boolean) {
        const { nodes, keys } = getKeysAndNodes('expand');

        emit('update:expandedKeys', keys);
        emit('expand', node.rawNode, {
            expanded,
            expandKeys: keys,
            expandNodes: nodes
        });
    }

    /**
     * 处理选中的节点
     */
    function handleSelect(node: TreeNode, canMulti: boolean | undefined) {
        let keys = Array.from(selectKeysRef.value);

        // 不能选择
        if (!props.selectable) return;

        let selected = false;

        if (props.multiple && canMulti) {
            const index = keys.findIndex(
                key => key === treeOptions.getKey(node)
            );
            if (index > -1) {
                // 已选中则删除
                keys.splice(index, 1);
            } else {
                // 未选中则添加
                keys.push(treeOptions.getKey(node));
                selected = true;
            }
        } else {
            if (keys.includes(treeOptions.getKey(node))) {
                keys = [];
            } else {
                keys = [treeOptions.getKey(node)];
                selected = true;
            }
        }
        selectKeysRef.value = keys;
        emit('update:selectedKeys', keys);
        emit('select', node.rawNode, {
            selected,
            selectedKeys: keys,
            selectedNodes: getSelectedNodes()
        });
    }

    function isChecked(node: TreeNode) {
        return checkedKeysRef.value.has(treeOptions.getKey(node));
    }

    function isDisabled(node: TreeNode) {
        return !!node.disabled;
    }

    function isIndeterminate(node: TreeNode) {
        return indeterminateRefs.value.has(treeOptions.getKey(node));
    }

    /**
     * 自上而下的更新选中
     */
    function updateCheckToBottom(node: TreeNode, checked: boolean) {
        if (!node) return;
        const checkedKeys = checkedKeysRef.value;

        if (checked) {
            // 选中的时候去掉半选状态
            indeterminateRefs.value.delete(treeOptions.getKey(node));
        }

        checkedKeys[checked ? 'add' : 'delete'](treeOptions.getKey(node));

        const children = node.children;
        if (children) {
            children.forEach(child => {
                if (!child.disabled) {
                    updateCheckToBottom(child, checked);
                }
            });
        }
    }

    /**
     * 自下而上的更新选中
     */
    function updateCheckToTop(node: TreeNode) {
        const parent = node.parentKey;
        if (parent) {
            const parenNode = findNode(node.parentKey!);
            if (parenNode) {
                let allChecked = true,
                    hasChecked = false;
                const children = parenNode.children;
                for (const child of children) {
                    if (checkedKeysRef.value.has(child.key)) {
                        // 儿子有被选中的
                        hasChecked = true;
                    } else if (indeterminateRefs.value.has(child.key)) {
                        // 儿子有半选的
                        allChecked = false;
                        hasChecked = true;
                    } else {
                        // 儿子没有被选中的
                        allChecked = false;
                    }
                }
                if (allChecked) {
                    checkedKeysRef.value.add(treeOptions.getKey(parenNode));
                    indeterminateRefs.value.delete(treeOptions.getKey(parenNode));
                } else if (hasChecked) {
                    checkedKeysRef.value.delete(treeOptions.getKey(parenNode));
                    indeterminateRefs.value.add(treeOptions.getKey(parenNode));
                } else {
                    checkedKeysRef.value.delete(treeOptions.getKey(parenNode));
                    indeterminateRefs.value.delete(treeOptions.getKey(parenNode));
                }
                updateCheckToTop(parenNode);
            }
        }
    }

    function updateCheck(node: TreeNode, checked: boolean) {
        updateCheckToBottom(node, checked);
        updateCheckToTop(node);
    }

    function toggleCheck(node: TreeNode, checked: boolean) {
        updateCheck(node, checked);
        afterNodeCheck(node, checked);
    }

    const afterNodeCheck = (node: TreeNode, checked: boolean) => {
        const { checkedNodes, checkedKeys } = getChecked();
        const { nodes: halfCheckedNodes, keys: halfCheckedKeys } =
            getKeysAndNodes('indeterminate');
        emit('check', node.rawNode, {
            checkedKeys,
            checkedNodes,
            halfCheckedKeys,
            halfCheckedNodes,
            checked
        });
    };

    function getCheckedKeys(leafOnly = false): TreeKey[] {
        return getChecked(leafOnly).checkedKeys;
    }

    function getCheckedNodes(leafOnly = false): TreeOption[] {
        return getChecked(leafOnly).checkedNodes;
    }

    function getHalfCheckedKeys(): TreeKey[] {
        return getKeysAndNodes('indeterminate').keys;
        // return getHalfChecked().halfCheckedKeys;
    }

    function getHalfCheckedNodes(): TreeOption[] {
        return getKeysAndNodes('indeterminate').nodes;
        // return getHalfChecked().halfCheckedNodes;
    }

    function getChecked(leafOnly = false): {
        checkedKeys: TreeKey[];
        checkedNodes: TreeOption[];
    } {
        const checkedNodes: TreeOption[] = [];
        const keys: TreeKey[] = [];
        if (tree?.value && props.showCheckbox) {
            const { treeNodeMap } = tree.value;
            checkedKeysRef.value.forEach(key => {
                const node = treeNodeMap.get(key);
                if (node && (!leafOnly || (leafOnly && node.isLeaf))) {
                    keys.push(key);
                    checkedNodes.push(node.rawNode);
                }
            });
        }
        return {
            checkedKeys: keys,
            checkedNodes
        };
    }

    // function getHalfChecked(): {
    //     halfCheckedKeys: TreeKey[];
    //     halfCheckedNodes: TreeOption[];
    // } {
    //     const halfCheckedNodes: TreeOption[] = [];
    //     const halfCheckedKeys: TreeKey[] = [];
    //     if (tree?.value && props.showCheckbox) {
    //         const { treeNodeMap } = tree.value;
    //         indeterminateRefs.value.forEach(key => {
    //             const node = treeNodeMap.get(key);
    //             if (node) {
    //                 halfCheckedKeys.push(key);
    //                 halfCheckedNodes.push(node.rawNode);
    //             }
    //         });
    //     }
    //     return {
    //         halfCheckedNodes,
    //         halfCheckedKeys
    //     };
    // }

    // function getSelected(): {
    //     selectedKeys: TreeKey[];
    //     selectedNodes: TreeOption[];
    // } {
    //     const selectedNodes: TreeOption[] = [];
    //     const keys: TreeKey[] = [];
    //     if (tree?.value && props.showCheckbox) {
    //         const { treeNodeMap } = tree.value;
    //         selectKeysRef.value.forEach(key => {
    //             const node = treeNodeMap.get(key);
    //             if (node) {
    //                 keys.push(key);
    //                 selectedNodes.push(node.rawNode);
    //             }
    //         });
    //     }
    //     return {
    //         selectedKeys: keys,
    //         selectedNodes: selectedNodes
    //     };
    // }

    // function getExpanded(): {
    //     expandedKeys: TreeKey[];
    //     expandedNodes: TreeOption[];
    // } {
    //     const expandedNodes: TreeOption[] = [];
    //     const keys: TreeKey[] = [];
    //     if (tree?.value && props.showCheckbox) {
    //         const { treeNodeMap } = tree.value;
    //         expandedKeysSet.value.forEach(key => {
    //             const node = treeNodeMap.get(key);
    //             if (node) {
    //                 keys.push(key);
    //                 expandedNodes.push(node.rawNode);
    //             }
    //         });
    //     }
    //     return {
    //         expandedKeys: keys,
    //         expandedNodes: expandedNodes
    //     };
    // }

    function getSelectedKeys(): TreeKey[] {
        return getKeysAndNodes('select').keys;
    }

    function getSelectedNodes(): TreeOption[] {
        return getKeysAndNodes('select').nodes;
    }

    function getExpandedKeys(): TreeKey[] {
        return getKeysAndNodes('expand').keys;
    }

    function getExpandedNodes(): TreeOption[] {
        return getKeysAndNodes('expand').nodes;
    }

    function getKeysAndNodes(target: keyof typeof refsMap): {
        keys: TreeKey[];
        nodes: TreeOption[];
    } {
        const dataSource = refsMap[target];
        const nodes: TreeOption[] = [];
        const keys: TreeKey[] = [];
        if (tree.value) {
            const { treeNodeMap } = tree.value;
            dataSource.value!.forEach(key => {
                const node = treeNodeMap.get(key);
                if (node) {
                    keys.push(key);
                    nodes.push(node);
                }
            });
        }
        return {
            keys,
            nodes
        };
    }

    // 监控数据变化，调用格式化函数
    watch(
        () => props.data!,
        (data: TreeOption[]) => {
            tree.value = createTree(data);
        },
        {
            immediate: true
        }
    );

    watch(
        () => props.selectedKeys,
        value => {
            if (value) {
                selectKeysRef.value = value;
            }
        },
        {
            immediate: true
        }
    );

    watch(
        () => props.expandedKeys,
        value => {
            if (value) {
                expandedKeysSet.value = new Set(value);
            }
        },
        {
            immediate: true
        }
    );

    return {
        flattenTree,
        loadingKeysRef,
        checkedKeysRef,
        selectKeysRef,
        treeOptions,
        isExpanded,
        toggleExpand,
        handleSelect,
        isChecked,
        isDisabled,
        isIndeterminate,
        toggleCheck,
        findNode,
        getCheckedKeys,
        getCheckedNodes,
        getHalfCheckedKeys,
        getHalfCheckedNodes,
        getSelectedKeys,
        getSelectedNodes,
        getExpandedKeys,
        getExpandedNodes
    };
}
