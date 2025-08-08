import { ExtractPropTypes, PropType } from 'vue';
import { inputEmits, inputProps } from '../../../input/src/input';
import { formItemProps } from '../form-item';
import { omit } from '@mealcomes/utils/object';

/**
 * form-item-input 组件 props
 */
export const formItemInputProps = {
    ...omit(inputProps, 'size'),
    ...omit(formItemProps, ['label', 'labelWidth']),
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

/**
 * form-item-input 组件 emits
 */
export const formItemInputEmits = {
    ...inputEmits
};

/**
 * form-item-input 组件 emits 类型
 */
export type FormItemInputEmits = typeof formItemInputEmits;
