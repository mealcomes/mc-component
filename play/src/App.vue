<script setup lang="ts">
import type { TreeOption } from '@mealcomes/components/tree';
import { AddCircle } from '@vicons/ionicons5'
import { ref } from 'vue';

function createData(level = 4, parentKey = ''): TreeOption[] {
    if (!level) return [];
    const arr = new Array(6 - level).fill(0);
    return arr.map((_, idx: number) => {
        const key = parentKey + level + idx;
        return {
            xx: createLabel(level), // 显示的内容
            key,                       // 为了唯一性
            children: createData(level - 1, key) // 孩子
        } as unknown as TreeOption;
    })
}

function createLabel(level: number): string {
    switch (level) {
        case 4:
            return '道生一';
        case 3:
            return '一生二';
        case 2:
            return '二生三';
        case 1:
            return '三生万物';
        default:
            return '';
    }
}
const data = ref<TreeOption[]>(createData());

</script>
<template>
    <m-icon :color="'red'" :size="20">
        <AddCircle> </AddCircle>
    </m-icon>
    <m-icon :color="'yellow'" :size="20">
        <AddCircle> </AddCircle>
    </m-icon>

    <!-- 在使用树组件的时候，会传递一个树形的结构 -->
    <m-tree :data="data" label-field="xx" key-field="key" children-field="children"
        :default-expanded-keys="['40', '41']"></m-tree>
</template>
