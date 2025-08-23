<script setup lang="ts">
import type {
    ExpandInfo,
    TreeKey,
    TreeOption
} from '@mealcomes/components/tree';
import { Random } from 'mockjs';
import { ref, type DefineComponent } from 'vue';
import VirtualListItem from './component/VirtualListItem.vue';

/* tree 组件 */

/**
 * 同步创建数据
 */
// function createData(level = 4, parentKey = ''): TreeOption[] {
//     if (!level) return [];
//     const arr = new Array(6 - level).fill(0);
//     return arr.map((_, idx: number) => {
//         const key = parentKey + level + idx;
//         return {
//             label: createLabel(level), // 显示的内容
//             key, // 为了唯一性
//             children: createData(level - 1, key), // 孩子
//             disabled: false
//         } as unknown as TreeOption;
//     });
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

/**
 * 异步创建数据
 */
function createDataAsync(): TreeOption[] {
    return [
        {
            label: nextLabel(),
            key: 1,
            isLeaf: false // isLeaf 为 false, 但没有 children, 表示是动态加载节点
        },
        {
            label: nextLabel(),
            key: 2,
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

const data = ref<TreeOption[]>(createDataAsync());
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

const value = ref<TreeKey[]>([]);

/* checkbox 组件 */

// const check = ref(true);
// const disabled = ref(false);
// const handleChange = (val: boolean) => {
//     console.log(val);
// };

/* button 组件 */

// const handleClick = () => {
//     console.log('click');
// };

/* input 组件 */

// const username = ref<string>('MC-Component');
// const handleInputChange = (val: string) => {
//     console.log('change:', val);
// };
// const handleInputBlur = () => {
//     console.log('blur');
// };
// const handleInputFocus = () => {
//     console.log('focus');
// };
// const handleInputInput = (val: string) => {
//     console.log('input: ', val);
// };
// const handleInputClear = () => {
//     console.log('clear');
// };

/* form */

// const state = reactive({
//     username: '',
//     password: ''
// });
// const formRef = ref<FormInstance>();
// const validateForm = () => {
//     formRef.value?.validate((valid, errors) => {
//         console.log(valid, errors);
//     });
// };

/* form-item-input */

// const state = reactive({
//     username: '',
//     password: ''
// });

/* upload */

// const handleBeforeUpload = () => {
//     return true;
// };
// const fileList = ref([]);
// const mcUploadRef = ref<UploadInstance>();
// const submitFile = () => {
//     mcUploadRef.value?.submit();
// };

/* calendar */

// const currentDate = ref(new Date());

/* virtual-scroll-list */

const totalCount = 100;

interface DataType {
    id: number;
    name: string;
    desc: string;
    index: number;
}

const dataSource = ref<Array<DataType>>([]);
let index = 0;
while (index++ !== totalCount) {
    dataSource.value.push({
        id: index,
        name: Random.name(),
        desc: Random.csentence(20, 200),
        index
    });
}
</script>
<template>
    <!-- <mc-icon :color="'red'" :size="20">
        <AddCircle> </AddCircle>
    </mc-icon>
    <mc-icon :color="'yellow'" :size="20">
        <AddCircle> </AddCircle>
    </mc-icon> -->

    <!-- 在使用树组件的时候，会传递一个树形的结构 -->
    <mc-tree
        :data="data"
        label-field="label"
        :load="handleLoad"
        :default-expanded-keys="new Array(30).fill('4').map((v, k) => v + k)"
        v-model:selected-keys="value"
        :selectable="true"
        :multiple="true"
        :default-checked-keys="['40']"
        :height="200"
        :show-checkbox="true"
        @check="
            (...args) => {
                console.log(...args);
            }
        "
        @expand="(data: TreeOption, expandInfo: ExpandInfo) => console.log(data, expandInfo)"
        @loaded="(loadedData, node) => console.log(loadedData, node)"
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

    <!-- <mc-checkbox
        v-model="check"
        :disabled="disabled"
        :indeterminate="false"
        @change="handleChange"
    >
        Checkbox - {{ check }}
        <mc-button @click="disabled = !disabled">
            {{ disabled ? `启用` : `禁用` }}
        </mc-button>
    </mc-checkbox> -->

    <!-- <mc-button
        size="default"
        type="success"
        :disabled="false"
        round
        :loading="false"
        iconPlacement="right"
        :circle="false"
        @click="handleClick"
    >
        <template #icon>
            <AddCircle> </AddCircle>
        </template>
        开始
    </mc-button> -->

    <!-- <mc-input
        placeholder="请输入姓名"
        v-model="username"
        @change="handleInputChange"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
        @input="handleInputInput"
        @clear="handleInputClear"
        :show-password="false"
        clearable
        :disabled="false"
        :readonly="false"
        size="default"
    >
        <template #prepend>
            <mc-button size="small">prepend</mc-button>
        </template>
        <template #prefix>
            <mc-icon :size="20">
                <AddCircle> </AddCircle>
            </mc-icon>
        </template>
        <template #suffix> suffix </template>
        <template #append>
            <mc-button size="small">append</mc-button>
        </template>
    </mc-input>
    {{ username }} -->

    <!-- <mc-form
        ref="formRef"
        :model="state"
        :rules="{
            username: {
                min: 6,
                max: 10,
                message: '用户名6-10位',
                trigger: ['change', 'blur']
            }
        }"
        @submit.prevent="validateForm"
    >
        <mc-form-item
            prop="username"
            label="姓名"
            size="large"
            :rules="[
                { required: true, message: '请输入用户名', trigger: 'blur' },
                {
                    min: 6,
                    max: 10,
                    message: '用户名6-10位',
                    trigger: ['change', 'blur']
                }
            ]"
        >
            <mc-input
                placeholder="请输入姓名"
                v-model="state.username"
            ></mc-input>
            <template #label> 姓名 </template>
        </mc-form-item>
        <mc-form-item
            prop="password"
            label="密码"
            size="large"
            :rules="[
                { required: true, message: '请输入密码', trigger: 'blur' }
            ]"
        >
            <mc-input
                placeholder="请输入密码"
                v-model="state.password"
            ></mc-input>
        </mc-form-item>
        <mc-button native-type="submit" type="primary" @click="validateForm"
            >提交</mc-button
        >
    </mc-form> -->

    <!-- <mc-upload
        ref="mcUploadRef"
        v-model:file-list="fileList"
        multiple
        list-type="picture-card"
        action="http://localhost:4000/upload"
        accept=".jpg"
        :directory="true"
        :before-upload="handleBeforeUpload"
        :drag="true"
        :auto-upload="false"
        :disabled="false"
    >
        <mc-button size="large">上传</mc-button>
    </mc-upload>
    <mc-button type="primary" @click="submitFile">提交至服务器</mc-button>
    {{ fileList }} -->

    <!-- <mc-form :model="state" @submit.prevent>
        <mc-form-item-input
            prop="username"
            v-model="state.username"
            placeholder="用户名"
            label-width="56.2px"
            :rules="[
                { required: true, message: '请输入用户名', trigger: 'change' }
            ]"
        ></mc-form-item-input>
        <mc-form-item-input
            prop="password"
            v-model="state.password"
            placeholder="密码"
            label-width="56.2px"
            show-password
            :rules="[
                { required: true, message: '请输入密码', trigger: 'change' }
            ]"
        ></mc-form-item-input>
    </mc-form> -->

    <!-- <div style="width: 600px">
        <mc-calendar v-model="currentDate" :mini="true">
            <template #date-cell="{ data }">
                <p
                    :class="data.isSelected ? 'is-selected' : ''"
                    style="
                        display: flex;
                        margin: 0;
                        height: 100%;
                        justify-content: center;
                        align-items: center;
                    "
                >
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '✔️' : '' }}
                </p>
            </template>
        </mc-calendar>
    </div> -->

    <mc-virtual-scroll-list
        class="virtual-list"
        :data-source="dataSource"
        :keeps="10"
        :estimated-row-height="80"
        :data-component="VirtualListItem as unknown as DefineComponent<object, object, unknown>"
        :cache="2"
        data-key="id"
    ></mc-virtual-scroll-list>
</template>

<style lang="scss" scoped>
.virtual-list {
    width: 100%;
    height: 200px;
    border: 2px solid red;
}
</style>
