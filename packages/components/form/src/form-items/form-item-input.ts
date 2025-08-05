import { ExtractPropTypes, PropType } from 'vue';
import { inputEmits, inputProps } from '../../../input/src/input';
import { formItemProps } from '../form-item';

/**
 * form-item-input 组件 props
 */
export const formItemInputProps = {
    ...inputProps,
    ...formItemProps,
    /**
     * placeholder 为 label 时的宽度
     */
    labelWidth: {
        type: [String, Number] as PropType<string | number>,
        default: ''
    }
};

/**
 * form-item-input 组件 props
 */
export type FormItemInputProps = ExtractPropTypes<typeof formItemInputProps>;

export const formItemInputEmits = {
    ...inputEmits
};

export type FormItemInputEmits = typeof formItemInputEmits;
