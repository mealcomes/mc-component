<template>
    <div :class="bem.b()">
        <m-tree-node v-for="node in flattenTree" :key="node.key" :node="node" :expanded="isExpanded(node)"
            @toggle="toggleExpand">
        </m-tree-node>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { TreeNode, TreeOption, treeProps } from './tree';
import { createNamespace } from '@mealcomes/utils';
import MTreeNode from './treeNode.vue'

const bem = createNamespace('tree');

defineOptions({
    name: 'm-tree'
})
const props = defineProps(treeProps);

// 需要对用户传入的 props 进行格式化

// 将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([])

function createOptions(key: string, label: string, children: string) {
    return {
        getKey(node: TreeOption) {
            return node[key] as string;   // 用户传递的 key
        },
        getLabel(node: TreeOption) {
            return node[label] as string; // 用户传递的 label
        },
        getChildren(node: TreeOption) {
            return node[children] as TreeOption[];  // 用户传递的 children 获取孩子
        }
    }
}

const treeOptions = createOptions(
    props.keyField,
    props.labelField,
    props.childrenField
);

function createTree(data: TreeOption[]): TreeNode[] {
    function traversal(data: TreeOption[], parent: TreeNode | null = null): TreeNode[] {
        return data.map((node: TreeOption) => {
            const children = treeOptions.getChildren(node) || [];
            const treeNode: TreeNode = {
                key: treeOptions.getKey(node),
                label: treeOptions.getLabel(node),
                children: [],   // 默认为空
                rawNode: node,
                level: parent ? parent.level + 1 : 0,
                // 以 node 属性 isLeaf 为准，其次是判断孩子是否为空
                // ?? 是对 || 的增强, 即只有 node.isLeaf 不存在的时候, 才会走到后面, 而不是为 false 时
                isLeaf: node.isLeaf ?? children.length == 0,
            }
            if (children.length > 0) {
                // 有孩子则递归孩子，将孩子也格式化成 treeNode 类型
                treeNode.children = traversal(children, treeNode);
            }
            return treeNode;
        })
    }

    const result: TreeNode[] = traversal(data);

    return result;
}

// 监控数据变化，调用格式化函数
watch(
    () => props.data,
    (data: TreeOption[]) => {
        tree.value = createTree(data);
        console.log(tree.value);
    },
    {
        immediate: true
    });

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
    let flattenNodes: TreeNode[] = [];  // 拍平后的结果
    const nodes = tree.value || [];  // 被格式化后的节点

    const stack: TreeNode[] = [];  // 用于遍历树的栈
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
 * 展开子树
 */
function expand(node: TreeNode) {
    expandedKeysSet.value.add(node.key);
}

/**
 * 切换展开状态
 */
function toggleExpand(node: TreeNode) {
    const expandKeys = expandedKeysSet.value;
    if (expandKeys.has(node.key)) {
        collapse(node);
    } else {
        expand(node);
    }
}

</script>
