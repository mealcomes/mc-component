<template>
    <mc-tree class="vp-raw" :data="data" selectable>
        <template #default="{ node }">
            <mc-icon>
                <component v-if="!node.isLeaf" :is="Folder" />
                <component v-else :is="Document" />
            </mc-icon>
            <span class="custom-label">{{ node.label }}</span>
        </template>
    </mc-tree>
</template>

<script setup lang="ts">
import { Folder } from '@vicons/ionicons5';
import { Document } from '@vicons/ionicons5';

const data = [
    {
        label: 'packages',
        key: '1',
        children: [
            {
                label: 'src',
                key: '11',
                children: [
                    {
                        label: 'main.js',
                        key: '111',
                        isLeaf: true
                    },
                    {
                        label: 'App.vue',
                        key: '112',
                        isLeaf: true
                    }
                ]
            },
            {
                label: 'package.json',
                key: '12',
                isLeaf: true
            }
        ]
    },
    {
        label: 'docs',
        key: '2',
        children: [
            {
                label: 'README.md',
                key: '21',
                isLeaf: true
            }
        ]
    }
];
</script>

<style scoped>
.custom-label {
    margin-left: 6px;
    font-weight: 500;
}
</style>
