import type { ExtractPropTypes, InjectionKey, PropType } from 'vue';
import type { Arrayable, FormItemContext, FormItemRule } from './form-item';

/**
 * form 组件 props
 */
export const formProps = {
    /**
     * 数据源
     */
    model: Object,
    /**
     * 表单校验规则
     */
    rules: {
        type: Object as PropType<Record<string, Arrayable<FormItemRule>>>
    },
    /**
     * 表单是否展示错误信息
     */
    showMessage: {
        type: Boolean,
        default: true
    }
} as const;

/**
 * form 组件 props 类型
 */
export type FormProps = Partial<ExtractPropTypes<typeof formProps>>;

/**
 * form 组件上下文
 */
export interface FormContext extends FormProps {
    addField: (field: FormItemContext) => void
};

/**
 * form 组件上下文 key
 */
export const formContextKey: InjectionKey<FormContext> = Symbol('_fc_k');

// export const 
