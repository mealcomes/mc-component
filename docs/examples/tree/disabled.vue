<template>
    <mc-tree class="vp-raw" :data="data" show-checkbox />
</template>

<script lang="ts" setup>
const data = [
    {
        key: 1,
        label: 'Level one 1',
        children: [
            {
                key: 3,
                label: 'Level two 2-1',
                children: [
                    {
                        key: 4,
                        label: 'Level three 3-1-1'
                    },
                    {
                        key: 5,
                        label: 'Level three 3-1-2',
                        disabled: true
                    }
                ]
            },
            {
                key: 2,
                label: 'Level two 2-2',
                disabled: true,
                children: [
                    {
                        key: 6,
                        label: 'Level three 3-2-1'
                    },
                    {
                        key: 7,
                        label: 'Level three 3-2-2',
                        disabled: true
                    }
                ]
            }
        ]
    }
];
</script>
