<template>
    <div :class="bem.b()">
        <MCVirtualList
            v-if="!!height"
            :items="flattenTree"
            :size="itemSize"
            :height="height"
        >
            <template #default="{ node }">
                <MCTreeNode
                    :class="bem.is('multiple', multiple)"
                    :key="node.key"
                    :node="node"
                    :expanded="isExpanded(node)"
                    :loadingKeys="loadingKeysRef"
                    :selectedKeys="selectKeysRef"
                    :show-checkbox="showCheckbox"
                    :checked="isChecked(node)"
                    :disabled="isDisabled(node)"
                    :indeterminate="isIndeterminate(node)"
                    :size="itemSize"
                    @toggle="toggleExpand"
                    @check="toggleCheck"
                    @select="handleSelect"
                >
                </MCTreeNode>
            </template>
        </MCVirtualList>
        <MCTreeNode
            v-else
            v-for="node in flattenTree"
            :class="bem.is('multiple', multiple)"
            :key="treeOptions.getKey(node)"
            :node="node"
            :expanded="isExpanded(node)"
            :loadingKeys="loadingKeysRef"
            :selectedKeys="selectKeysRef"
            :show-checkbox="showCheckbox"
            :checked="isChecked(node)"
            :disabled="isDisabled(node)"
            :indeterminate="isIndeterminate(node)"
            :size="itemSize"
            @toggle="toggleExpand"
            @check="toggleCheck"
            @select="handleSelect"
        >
        </MCTreeNode>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue';
import { treeEmits, treeInjectKey, treeProps } from './tree';
import type { Key, TreeNode, TreeOption } from './tree';
import { createNamespace } from '@mealcomes/utils';
import MCTreeNode from './treeNode.vue';
import MCVirtualList from '@mealcomes/components/virtual-list';

const bem = createNamespace('tree');

defineOptions({
    name: 'mc-tree'
});
const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);

// 需要对用户传入的 props 进行格式化

// 将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([]);

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
    props.keyField,
    props.labelField,
    props.childrenField
);

function createTree(
    data: TreeOption[],
    parent: TreeNode | null = null
): TreeNode[] {
    function traversal(
        data: TreeOption[],
        parent: TreeNode | null = null
    ): TreeNode[] {
        return data.map((node: TreeOption) => {
            const children = treeOptions.getChildren(node) || [];
            const treeNode: TreeNode = {
                key: treeOptions.getKey(node),
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
            return treeNode;
        });
    }

    const result: TreeNode[] = traversal(data, parent);

    return result;
}

// 监控数据变化，调用格式化函数
watch(
    () => props.data,
    (data: TreeOption[]) => {
        tree.value = createTree(data);
    },
    {
        immediate: true
    }
);

// 需要将树展开，点击实现展开操作
// 会有默认展开项

// 需要展开的 key
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys));

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
    let expandedKeys = expandedKeysSet.value; // 所有要展开的 key
    let flattenNodes: TreeNode[] = []; // 拍平后的结果
    const nodes = tree.value || []; // 被格式化后的节点

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

        if (expandedKeys.has(node.key)) {
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

/**
 * 从 flattenTree 中找到指定 key 的 node
 */
function findNode(key: Key) {
    return flattenTree.value.find(node => node.key === key);
}

function isExpanded(node: TreeNode): boolean {
    return expandedKeysSet.value.has(node.key);
}

/**
 * 折叠子树
 */
function collapse(node: TreeNode) {
    expandedKeysSet.value.delete(node.key);
}
/**
 * 正处于加载中的 key, 用于防止用户多次点击同一个 key
 */
const loadingKeysRef = ref(new Set<Key>());

/**
 * 触发 children 加载
 */
function triggerLoading(node: TreeNode) {
    // 不是叶子节点但孩子长度为 0, 则说明需要异步加载
    if (!node.children.length && !node.isLeaf) {
        const loadingKeys = loadingKeysRef.value;
        if (!loadingKeys.has(node.key)) {
            loadingKeys.add(node.key);
            const onLoad = props.onLoad;
            if (onLoad) {
                onLoad(node.rawNode)
                    .then(children => {
                        // 修改节点的原始 children(即用户传入的 children)
                        node.rawNode.children = children;
                        // 对 children 进行规范化
                        node.children = createTree(children, node);
                        loadingKeys.delete(node.key);
                    })
                    .catch(() => {
                        node.isLeaf = true;
                    });
            }
        }
    }
}

/**
 * 展开子树
 */
function expand(node: TreeNode) {
    // 触发懒加载
    triggerLoading(node);
    expandedKeysSet.value.add(node.key);
}

/**
 * 切换展开状态
 */
function toggleExpand(node: TreeNode) {
    const expandKeys = expandedKeysSet.value;
    if (
        expandKeys.has(node.key) &&
        !loadingKeysRef.value.has(node.key) // 如果当前节点正处于加载中, 则不能收起
    ) {
        collapse(node);
    } else {
        expand(node);
    }
}

const selectKeysRef = ref<Key[]>([]);
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

/**
 * 处理选中的节点
 */
function handleSelect(node: TreeNode, canMulti: boolean | undefined) {
    let keys = Array.from(selectKeysRef.value);

    // 不能选择
    if (!props.selectable) return;

    if (props.multiple && canMulti) {
        let index = keys.findIndex(key => key === node.key);
        if (index > -1) {
            // 已选中则删除
            keys.splice(index, 1);
        } else {
            // 未选中则添加
            keys.push(node.key);
        }
    } else {
        if (keys.includes(node.key)) {
            keys = [];
        } else {
            keys = [node.key];
        }
    }
    emit('update:selectedKeys', keys);
}

provide(treeInjectKey, {
    slots: useSlots()
});

const checkedKeysRef = ref(new Set(props.defaultCheckedKeys));

function isChecked(node: TreeNode) {
    return checkedKeysRef.value.has(node.key);
}

function isDisabled(node: TreeNode) {
    return !!node.disabled;
}

const indeterminateRefs = ref<Set<Key>>(new Set());

function isIndeterminate(node: TreeNode) {
    return indeterminateRefs.value.has(node.key);
}

/**
 * 自上而下的更新选中
 */
function updateCheckToBottom(node: TreeNode, checked: boolean) {
    if (!node) return;
    const checkedKeys = checkedKeysRef.value;

    if (checked) {
        // 选中的时候去掉半选状态
        indeterminateRefs.value.delete(node.key);
    }

    checkedKeys[checked ? 'add' : 'delete'](node.key);

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
            for (let child of children) {
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
                checkedKeysRef.value.add(parenNode.key);
                indeterminateRefs.value.delete(parenNode.key);
            } else if (hasChecked) {
                checkedKeysRef.value.delete(parenNode.key);
                indeterminateRefs.value.add(parenNode.key);
            } else {
                checkedKeysRef.value.delete(parenNode.key);
                indeterminateRefs.value.delete(parenNode.key);
            }
            updateCheckToTop(parenNode);
        }
    }
}

function toggleCheck(node: TreeNode, checked: boolean) {
    updateCheckToBottom(node, checked);
    updateCheckToTop(node);
}

onMounted(() => {
    checkedKeysRef.value.forEach(key => {
        const node = findNode(key) as TreeNode;
        if (node) {
            toggleCheck(node, true);
        }
    });
});
</script>
