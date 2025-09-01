<template>
    <mc-tree
        class="vp-raw"
        :load="loadNode"
        :data="data"
        @loaded="handleLoaded"
    />
</template>

<script lang="ts" setup>
import type { TreeOption } from 'mealcomes';
import { ref } from 'vue';

const data = ref(createDataAsync());
let cnt = 4;

function createDataAsync(): TreeOption[] {
    return [
        {
            label: nextLabel(),
            key: '1',
            isLeaf: false
        },
        {
            label: nextLabel(),
            key: '2',
            isLeaf: false
        }
    ];
}

function nextLabel(currentLabel?: string | number | undefined): string {
    if (!currentLabel) return 'Out of Tao, One is bore';
    if (currentLabel === 'Out of Tao, One is bore') return 'Out of One, Two';
    if (currentLabel === 'Out of One, Two') return 'Out of two, Tree';
    if (currentLabel === 'Out of two, Tree')
        return 'Out of tree, the create universe';
    if (currentLabel === 'Out of tree, the create universe') {
        return 'Out of Tao, One is born';
    }
    return '';
}

const loadNode = (node: TreeOption) => {
    return new Promise<TreeOption[]>((res, rej) => {
        setTimeout(() => {
            if (cnt <= 0) rej();
            cnt--;
            res([
                {
                    label: nextLabel(node.label),
                    key: `${node.key}-1`,
                    isLeaf: false
                },
                {
                    label: nextLabel(node.label),
                    key: `${node.key}-2`,
                    isLeaf: false
                }
            ]);
        }, 1000);
    });
};

function handleLoaded(loadedData: TreeOption[]) {
    console.log(loadedData);
}
</script>
