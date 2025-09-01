<template>
    <mc-tree class="vp-raw" :data="data" @expand="() => {}" />
</template>

<script lang="ts" setup>
import type { TreeOption } from 'mealcomes';

const data: TreeOption[] = [
    {
        label: 'Level one 1',
        key: '1',
        children: [
            {
                label: 'Level two 1-1',
                key: '11',
                children: [
                    {
                        label: 'Level three 1-1-1',
                        key: '111'
                    }
                ]
            }
        ]
    },
    {
        label: 'Level one 2',
        key: '2',
        children: [
            {
                label: 'Level two 2-1',
                key: '21',
                children: [
                    {
                        label: 'Level three 2-1-1',
                        key: '211'
                    }
                ]
            },
            {
                label: 'Level two 2-2',
                key: '22',
                children: [
                    {
                        label: 'Level three 2-2-1',
                        key: '221'
                    }
                ]
            }
        ]
    },
    {
        label: 'Level one 3',
        key: '3',
        children: [
            {
                label: 'Level two 3-1',
                key: '31',
                children: [
                    {
                        label: 'Level three 3-1-1',
                        key: '311'
                    }
                ]
            },
            {
                label: 'Level two 3-2',
                key: '32',
                children: [
                    {
                        label: 'Level three 3-2-1',
                        key: '321'
                    }
                ]
            }
        ]
    }
];
</script>
