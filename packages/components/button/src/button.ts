import { ExtractPropTypes, PropType } from 'vue';
import { ComponentSize } from '../../../constants';

export type Type =
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'default'
    | '';

export type NativeType = 'button' | 'submit' | 'reset';

export type Placement = 'left' | 'right';

/**
 * button 组件 props
 */
export const buttonProps = {
    /**
     * 按钮大小
     */
    size: {
        type: String as PropType<ComponentSize>
    },
    /**
     * 按钮类型
     */
    type: {
        type: String as PropType<Type>,
        validator: (val: string) => {
            return [
                'primary',
                'success',
                'warning',
                'danger',
                'info',
                'default',
                ''
            ].includes(val);
        }
    },
    /**
     * 圆角
     */
    round: {
        type: Boolean,
        default: false
    },
    /**
     * 是否加载中
     */
    loading: {
        type: Boolean,
        default: false
    },
    /**
     * 是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * 原始类型
     */
    nativeType: {
        type: String as PropType<NativeType>,
        default: 'button'
    },
    iconPlacement: {
        type: String as PropType<Placement>,
        default: 'left'
    }
} as const;

/**
 * button 组件 props 类型
 */
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;

/**
 * button 组件 emits
 */
export const buttonEmits = {
    /**
     * 点击事件
     */
    click: (e: MouseEvent) => e instanceof MouseEvent,
    /**
     * 鼠标按下事件
     */
    mousedown: (e: MouseEvent) => e instanceof MouseEvent
};

/**
 * button 组件 emits 类型
 */
export type ButtonEmits = typeof buttonEmits;
