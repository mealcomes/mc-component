import { withInstall } from '@mealcomes/utils';
import _FormItem from './src/form-item.vue';
import _Form from './src/form.vue';

const FormItem = withInstall(_FormItem);
const Form = withInstall(_Form);

export { FormItem, Form };

export type * from './src/form-item';
export * from './src/form-item';
export type * from './src/form';
export * from './src/form';

// 导出表单实例类型
export type FormInstance = InstanceType<typeof Form>

declare module 'vue' {
    export interface GlobalComponents {
        McFormItem: typeof FormItem;
        McForm: typeof Form;
    }
}
