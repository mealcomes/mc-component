import type { ExtractPropTypes, PropType } from 'vue';

/**
 * checkBox 组件 props
 */
export const checkboxProps = {
    /**
     * 是否选中
     */
    modelValue: {
        type: [Boolean, String, Number] as PropType<boolean | string | number>
    },
    /**
     * 是否半选
     */
    indeterminate: Boolean,
    /**
     * 是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    },
    label: {
        type: String as PropType<string>
    }
} as const;

/**
 * checkBox 组件 Props 类型
 */
export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>;

/**
 * checkbox 组件 emits
 */
export const checkboxEmits = {
    'update:modelValue': (value: boolean | string | number) =>
        typeof value === 'boolean',
    change: (value: boolean) => typeof value === 'boolean'
};

/**
 * checkbox 组件 emits 类型
 */
export type CheckboxEmits = typeof checkboxEmits;
