<template>
    <div class="vp-raw">
        <div class="buttons" style="margin-bottom: 1rem">
            <mc-button @click="() => (multiple = !multiple)" size="small">
                {{ multiple ? '切换为单选' : '切换为多选' }}
            </mc-button>
            <mc-button
                @click="() => (showCheckbox = !showCheckbox)"
                size="small"
            >
                {{ showCheckbox ? '隐藏复选框' : '展示复选框' }}
            </mc-button>
        </div>
        <mc-tree
            :data="data"
            v-model:selected-keys="selectedKeys"
            :default-checked-keys="checkedKeys"
            selectable
            :show-checkbox="showCheckbox"
            :multiple="multiple"
            @select="handleSelect"
            @check="handleCheck"
        ></mc-tree>
    </div>
</template>

<script setup lang="ts">
import type { CheckedInfo, SelectInfo, TreeKey, TreeOption } from 'mealcomes';
import { ref } from 'vue';

const selectedKeys = ref<TreeKey[]>([]);
const checkedKeys = ref<TreeKey[]>(['11', '2', '31']);
const multiple = ref(false);
const showCheckbox = ref(false);

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

const handleSelect = (target: TreeOption, selectInfo: SelectInfo) => {
    console.log(target, selectInfo);
    target.isLeaf = true;
};

const handleCheck = (target: TreeOption, checkInfo: CheckedInfo) => {
    console.log(target, checkInfo);
    target.isLeaf = true;
};
</script>
