import type { ExtractPropTypes } from 'vue';

/**
 * calendar 组件日期类型
 */
export type CalendarDateType =
    | 'prev-month'
    | 'next-month'
    | 'prev-year'
    | 'next-year'
    | 'today';

/**
 * calendar 组件 props
 */
export const calendarProps = {
    modelValue: {
        type: Date
    },
    /**
     * 是否为缩小版
     */
    mini: {
        type: Boolean,
        default: false
    }
} as const;

/**
 * calendar 组件 props 类型
 */
export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

/**
 * calendar 组件 emits
 */
export const calendarEmits = {
    'update:modelValue': (val: Date) => val instanceof Date
};

/**
 * calendar 组件 emits 类型
 */
export type CalendarEmits = typeof calendarEmits;
