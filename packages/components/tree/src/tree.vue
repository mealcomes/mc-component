<template>
    tree
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { TreeNode, TreeOption, treeProps } from './tree';

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
            const children = treeOptions.getChildren(node);
            const treeNode: TreeNode = {
                key: treeOptions.getKey(node),
                label: treeOptions.getLabel(node),
                children: [],   // 默认为空
                rowNode: node,
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

</script>
