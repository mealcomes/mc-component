<script setup lang="ts">
import type { TreeOption } from '@mealcomes/components/tree';
import { AddCircle } from '@vicons/ionicons5'
import { ref } from 'vue';

// function createData(level = 4, parentKey = ''): TreeOption[] {
//     if (!level) return [];
//     const arr = new Array(6 - level).fill(0);
//     return arr.map((_, idx: number) => {
//         const key = parentKey + level + idx;
//         return {
//             label: createLabel(level), // 显示的内容
//             key,                       // 为了唯一性
//             children: createData(level - 1, key) // 孩子
//         } as unknown as TreeOption;
//     })
// }

// function createLabel(level: number): string {
//     switch (level) {
//         case 4:
//             return '道生一';
//         case 3:
//             return '一生二';
//         case 2:
//             return '二生三';
//         case 1:
//             return '三生万物';
//         default:
//             return '';
//     }
// }

function createDataAsync(): TreeOption[] {
    return [
        {
            label: nextLabel(),
            key: 1,
            isLeaf: false,  // isLeaf 为 false, 但没有 children, 表示是动态加载节点
        },
        {
            label: nextLabel(),
            key: 2,
            isLeaf: false,
        }
    ]
}

function nextLabel(currentLabel?: string | number | undefined): string {
    if (!currentLabel) return 'Out of Tao, One is bore';
    if (currentLabel === 'Out of Tao, One is bore') return 'Out of One, Two';
    if (currentLabel === 'Out of One, Two') return 'Out of two, Tree';
    if (currentLabel === 'Out of two, Tree') return 'Out of tree, the create universe';
    if (currentLabel === 'Out of tree, the create universe') {
        return 'Out of Tao, One is born';
    }
    return '';
}

const data = ref<TreeOption[]>(createDataAsync());

let cnt = 4;
/**
 * 模拟传递后续展开的节点
 */
const handleLoad = (node: TreeOption) => {
    return new Promise<TreeOption[]>((res, rej) => {
        setTimeout(() => {
            if (cnt <= 0) rej();
            cnt--;
            res([
                {
                    label: nextLabel(node.label),
                    key: node.key + nextLabel(node.label),
                    isLeaf: false
                }
            ]);
        }, 1000);
    });
}

</script>
<template>
    <m-icon :color="'red'" :size="20">
        <AddCircle> </AddCircle>
    </m-icon>
    <m-icon :color="'yellow'" :size="20">
        <AddCircle> </AddCircle>
    </m-icon>

    <!-- 在使用树组件的时候，会传递一个树形的结构 -->
    <m-tree :data="data" label-field="label" :on-load="handleLoad" :default-expanded-keys="['40', '41']"></m-tree>
</template>
