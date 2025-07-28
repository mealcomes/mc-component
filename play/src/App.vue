<script setup lang="ts">
import type { Key, TreeOption } from '@mealcomes/components/tree';
import { AddCircle } from '@vicons/ionicons5';
import { ref } from 'vue';

/* tree 组件 */

/**
 * 同步创建数据
 */
function createData(level = 4, parentKey = ''): TreeOption[] {
    if (!level) return [];
    const arr = new Array(6 - level).fill(0);
    return arr.map((_, idx: number) => {
        const key = parentKey + level + idx;
        return {
            label: createLabel(level), // 显示的内容
            key, // 为了唯一性
            children: createData(level - 1, key) // 孩子
        } as unknown as TreeOption;
    });
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

/**
 * 异步创建数据
 */
// function createDataAsync(): TreeOption[] {
//     return [
//         {
//             label: nextLabel(),
//             key: 1,
//             isLeaf: false,  // isLeaf 为 false, 但没有 children, 表示是动态加载节点
//         },
//         {
//             label: nextLabel(),
//             key: 2,
//             isLeaf: false,
//         }
//     ]
// }

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

const data = ref<TreeOption[]>(createData());
// const data = ref<TreeOption[]>([
//     {
//         key: '0',
//         label: '0',
//         children: [
//             {
//                 key: '0-0',
//                 label: '0-0'
//             },
//             {
//                 disabled: true,
//                 key: '0-1',
//                 label: '0-1',
//                 children: [
//                     {
//                         label: '0-1-0',
//                         key: '0-1-0',
//                     },
//                     {
//                         label: '0-1-1',
//                         key: '0-1-1',
//                     },
//                 ]
//             }
//         ]
//     }
// ])

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
};

const value = ref<Key[]>([]);

/* checkbox 组件 */

const check = ref(true);
const disabled = ref(false);
const handleChange = (val: boolean) => {
    console.log(val);
};

/* button 组件 */

const handleClick = () => {
    console.log('click');
};

/* input 组件 */

const username = ref<string>('MC-Component');
const handleInputChange = (val: string) => {
    console.log('change:', val);
};
const handleInputBlur = () => {
    console.log('blur');
};
const handleInputFocus = () => {
    console.log('focus');
};
const handleInputInput = (val: string) => {
    console.log('input: ', val);
};
const handleInputClear = () => {
    console.log('clear');
};
</script>
<template>
    <mc-icon :color="'red'" :size="20">
        <AddCircle> </AddCircle>
    </mc-icon>
    <mc-icon :color="'yellow'" :size="20">
        <AddCircle> </AddCircle>
    </mc-icon>

    <!-- 在使用树组件的时候，会传递一个树形的结构 -->
    <mc-tree
        :data="data"
        label-field="label"
        :on-load="handleLoad"
        :default-expanded-keys="new Array(30).fill('4').map((v, k) => v + k)"
        v-model:selected-keys="value"
        selectable
        multiple
        show-checkbox
        :default-checked-keys="['40']"
    >
        <!-- 
            selectable - 可选节点
            multiple - 节点可多选
            selected-keys - 选中后的节点
        -->
        <template #default="{ node }">
            <div class="content" style="display: flex">
                <div
                    class="label"
                    style="color: aqua; border-radius: 5px; margin-right: 20px"
                >
                    {{ node.label }}
                </div>
                <div class="key" style="color: red; border-radius: 5px">
                    {{ node.key }}
                </div>
            </div>
        </template>
    </mc-tree>
    {{ value }}
    <mc-checkbox
        v-model="check"
        :disabled="disabled"
        :indeterminate="false"
        @change="handleChange"
    >
        Checkbox - {{ check }}
        <mc-button @click="disabled = !disabled">
            {{ disabled ? `启用` : `禁用` }}
        </mc-button>
    </mc-checkbox>
    <mc-button
        size="default"
        type="success"
        :disabled="false"
        round
        :loading="false"
        iconPlacement="right"
        @click="handleClick"
    >
        <template #icon>
            <AddCircle> </AddCircle>
        </template>
        开始
    </mc-button>

    <mc-input
        placeholder="请输入姓名"
        v-model="username"
        @change="handleInputChange"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
        @input="handleInputInput"
        @clear="handleInputClear"
        :show-password="true"
        clearable
    >
        <template #prepend>
            <mc-button size="small">prepend</mc-button>
        </template>
        <template #prefix>
            <mc-icon :size="20">
                <AddCircle> </AddCircle>
            </mc-icon>
        </template>
        <template #suffix>
            <!-- <mc-icon :size="20">
                <AddCircle> </AddCircle>
            </mc-icon> -->
        </template>
        <template #append>
            <mc-button size="small">append</mc-button>
        </template>
    </mc-input>
    {{ username }}
</template>
