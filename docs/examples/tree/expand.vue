<template>
    <mc-tree
        class="vp-raw"
        v-model:expanded-keys="expandedKeys"
        :data="data"
        @expand="handleExpand"
    >
    </mc-tree>
</template>

<script setup lang="ts">
import { ExpandInfo, TreeKey, TreeOption } from 'mealcomes';
import { ref } from 'vue';

const expandedKeys = ref<TreeKey[]>([2, 3]);

const data = [
    {
        key: 1,
        label: 'Level one 1',
        children: [
            {
                key: 4,
                label: 'Level two 1-1',
                children: [
                    {
                        key: 9,
                        label: 'Level three 1-1-1'
                    },
                    {
                        key: 10,
                        label: 'Level three 1-1-2'
                    }
                ]
            }
        ]
    },
    {
        key: 2,
        label: 'Level one 2',
        children: [
            {
                key: 5,
                label: 'Level two 2-1'
            },
            {
                key: 6,
                label: 'Level two 2-2'
            }
        ]
    },
    {
        key: 3,
        label: 'Level one 3',
        children: [
            {
                key: 7,
                label: 'Level two 3-1'
            },
            {
                key: 8,
                label: 'Level two 3-2'
            }
        ]
    }
];

const handleExpand = (target: TreeOption, expandInfo: ExpandInfo) => {
    console.log(target, expandInfo);
};
</script>
