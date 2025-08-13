import type { ExtractPropTypes, PropType } from 'vue';

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
     * 时间范围
     */
    range: {
        type: Array as unknown as PropType<[Date, Date]>
    },
    /**
     * 是否为缩小版
     */
    mini: {
        type: Boolean,
        default: true
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
