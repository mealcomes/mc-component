import { ExtractPropTypes, PropType } from 'vue';
import { ComponentSize } from '../../../constants';

/**
 * input 组件 props
 */
export const inputProps = {
    /**
     * 输入框类型
     */
    type: {
        type: String,
        default: 'text'
    },
    /**
     * 输入框值
     */
    modelValue: {
        type: [String, Number] as PropType<string | number>,
        default: ''
    },
    /**
     * 输入框占位符
     */
    placeholder: {
        type: String,
        default: ''
    },
    /**
     * 输入框是否可清空
     */
    clearable: {
        type: Boolean,
        default: false
    },
    /**
     * 输入框是否显示密码图标
     */
    showPassword: {
        type: Boolean,
        default: false
    },
    /**
     * 输入框是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * 输入框是否只读
     */
    readonly: {
        type: Boolean,
        default: false
    },
    /**
     * 等价于原生 input aria-label 属性
     */
    ariaLabel: {
        type: String,
        default: ''
    },
    size: {
        type: String as PropType<ComponentSize>,
        default: 'default'
    }
} as const;

/**
 * input 组件 props 类型
 */
export type InputProps = ExtractPropTypes<typeof inputProps>;

/**
 * input 组件 emits
 */
export const inputEmits = {
    /**
     * 输入框值变化时触发
     */
    'update:modelValue': (value: string) => typeof value === 'string',
    /**
     * 输入框输入时触发
     */
    input: (value: string) => typeof value === 'string',
    /**
     * 输入框失焦时触发
     */
    change: (value: string) => typeof value === 'string',
    /**
     * 输入框聚焦时触发
     */
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    /**
     * 输入框失焦时触发
     */
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    /**
     * 输入框清空时触发
     */
    clear: () => true,
    /**
     * 按键按下触发
     */
    keydown: (event: KeyboardEvent) => event instanceof KeyboardEvent
};

/**
 * input 组件 emits 类型
 */
export type InputEmits = typeof inputEmits;
