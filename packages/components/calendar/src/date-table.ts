import type { ExtractPropTypes, PropType } from 'vue';

import { Dayjs } from 'dayjs';
import { isObject } from '@mealcomes/utils';

export type CalendarDateCellType = 'next' | 'prev' | 'current';
export type CalendarDateCell = {
    text: number;
    type: CalendarDateCellType;
};

/**
 * 获取当前日期所在页面上一个月的天数
 */
export const getPrevMonthLastDays = (date: Dayjs, count: number) => {
    const lastDay = date.subtract(1, 'month').endOf('month').date();
    return Array.from({ length: count }).map(
        (_, index) => lastDay - (count - index - 1)
    );
};

/**
 * 获取当前月的天数
 */
export const getMonthDays = (date: Dayjs) => {
    const days = date.daysInMonth();
    return Array.from({ length: days }).map((_, index) => index + 1);
};

/**
 * 一维日历数组转为二维日历数组
 */
export const toNestedArr = (days: CalendarDateCell[]) =>
    Array.from({ length: days.length / 7 }).map((_, index) => {
        const start = index * 7;
        return days.slice(start, start + 7);
    });

/**
 * date-table 组件 props
 */
export const dateTableProps = {
    /**
     * 当前选中的天
     */
    selectedDay: {
        type: Object as PropType<Dayjs>
    },
    /**
     * 当前的日期
     */
    date: {
        type: Object as PropType<Dayjs>,
        required: true
    }
} as const;

/**
 * date-table 组件 props 类型
 */
export type DateTableProps = ExtractPropTypes<typeof dateTableProps>;

/**
 * date-table 组件 emits
 */
export const dateTableEmits = {
    /**
     * 当选中了某个日期的时候触发
     */
    pick: (value: Dayjs) => isObject(value)
};

/**
 * date-table 组件 emits 类型
 */
export type DateTableEmits = typeof dateTableEmits;
