import { withInstall } from '@mealcomes/utils';
import _Form from './src/form.vue';
import _FormItem from './src/form-item.vue';
import _FormItemInput from './src/form-items/form-item-input.vue';

export const McForm = withInstall(_Form);
export const McFormItem = withInstall(_FormItem);
export const McFormItemInput = withInstall(_FormItemInput);

export type * from './src/form';
export * from './src/form';
export type * from './src/form-item';
export * from './src/form-item';
export type * from './src/form-items/form-item-input';
export * from './src/form-items/form-item-input';

// 导出表单实例类型
export type FormInstance = InstanceType<typeof McForm>;

declare module 'vue' {
    export interface GlobalComponents {
        McForm: typeof McForm;
        McFormItem: typeof McFormItem;
        McFormItemInput: typeof McFormItemInput;
    }
}
