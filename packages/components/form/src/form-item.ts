import type { ExtractPropTypes, InjectionKey, PropType } from 'vue';
import type { RuleItem, ValidateFieldsError } from 'async-validator';
import type { ComponentSize } from '@mealcomes/constants';

export type Arrayable<T> = T | T[];

/**
 * 表单项校验规则
 */
export interface FormItemRule extends RuleItem {
    trigger?: string | string[];
}

/**
 * 表单校验状态
 */
export const formItemValidateState = [
    'success',
    'error',
    'validating',
    ''
] as const;

/**
 * 表单校验状态类型
 */
export type FormItemValidateState = (typeof formItemValidateState)[number];

/**
 * 表单项尺寸
 */
export const formItemSize = ['default', 'small', 'large'] as const;

/**
 * 表单项尺寸类型
 */
export type FormItemSize = (typeof formItemSize)[number];

/**
 * form-item 组件 props
 */
export const formItemProps = {
    /**
     * 表单域 model 字段
     */
    prop: {
        type: String,
        default: ''
    },
    /**
     * 表单 label
     */
    label: {
        type: String,
        default: ''
    },
    /**
     * label 宽度
     */
    labelWidth: {
        type: [String, Number] as PropType<string | number>,
        default: ''
    },
    /**
     * 表单校验规则
     */
    rules: {
        type: [Object, Array] as PropType<Arrayable<FormItemRule>>,
        default: () => []
    },
    /**
     * 是否显示校验错误信息
     */
    showMessage: {
        type: Boolean,
        default: true
    },
    size: {
        type: String as PropType<ComponentSize>,
        default: 'default'
    }
} as const;

/**
 * form-item 组件 props 类型
 */
export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>;

/**
 * form-item 组件上下文
 */
export interface FormItemContext extends FormItemProps {
    /**
     * 表单校验函数
     */
    validate: (
        trigger: string,
        callback?: (
            idValid: boolean,
            invalidFields?: ValidateFieldsError
        ) => void
    ) => Promise<boolean>;
}

/**
 * form-item 组件上下文 key
 */
export const formItemContextKey: InjectionKey<FormItemContext> =
    Symbol('_fic_k');
