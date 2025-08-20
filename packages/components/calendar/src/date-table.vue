<template>
    <table :class="[bemTable.b()]" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th v-for="day in weekDays" :key="day" scope="col">
                    {{ day }}
                </th>
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="(row, index) in rows"
                :key="index"
                :class="{
                    [bemTable.e('row')]: true
                }"
            >
                <td
                    v-for="(cell, key) in row"
                    :key="key"
                    :class="getCellClass(cell)"
                    @click="handlePickDay(cell)"
                >
                    <div :class="bemDay.b()">
                        <slot name="date-cell" :data="getSlotData(cell)">
                            <span>{{ cell.text }}</span>
                        </slot>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import {
    dateTableEmits,
    dateTableProps,
    getMonthDays,
    getPrevMonthLastDays,
    toNestedArr
} from './date-table';
import type { CalendarDateCell, CalendarDateCellType } from './date-table';
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData.js';
import { WEEK_DAYS } from '@mealcomes/constants';

defineOptions({
    name: 'date-table'
});

const bemTable = createNamespace('calendar-table');
const bemDay = createNamespace('calendar-day');
const props = defineProps(dateTableProps);
const emits = defineEmits(dateTableEmits);

const now = dayjs();
dayjs.extend(localeData);
const firstDayOfWeek: number = dayjs.localeData().firstDayOfWeek();

/**
 * 表头 星期
 */
const weekDays = computed(() => {
    const start = firstDayOfWeek;
    if (start === 0) {
        return WEEK_DAYS.map(val => val.slice(2));
    } else {
        return WEEK_DAYS.slice(start)
            .concat(WEEK_DAYS.slice(0, start))
            .map(val => val.slice(2));
    }
});

/**
 * 面板 日期(6行 * 7列)
 */
const rows = computed(() => {
    let days: CalendarDateCell[] = [];

    const firstDay = props.date.startOf('month').day();
    // 前一月的天数
    const prevMonthDays: CalendarDateCell[] = getPrevMonthLastDays(
        props.date,
        (firstDay - firstDayOfWeek + 7) % 7
    ).map(day => ({
        text: day,
        type: 'prev'
    }));
    // 当前月的天数
    const currentMonthDays: CalendarDateCell[] = getMonthDays(props.date).map(
        day => ({
            text: day,
            type: 'current'
        })
    );
    days = [...prevMonthDays, ...currentMonthDays];

    // 7 * 6
    const remaining = 42 - days.length;
    // 下一个月的天数
    const nextMonthDays: CalendarDateCell[] = Array.from({
        length: remaining
    }).map((_, index) => ({
        text: index + 1,
        type: 'next'
    }));
    days = days.concat(nextMonthDays);

    return toNestedArr(days);
});

const getFormattedDate = (day: number, type: CalendarDateCellType): Dayjs => {
    switch (type) {
        case 'prev':
            return props.date.startOf('month').subtract(1, 'month').date(day);
        case 'next':
            return props.date.startOf('month').add(1, 'month').date(day);
        case 'current':
            return props.date.date(day);
    }
};

/**
 * 获取当前插槽的数据
 */
const getSlotData = ({ text, type }: CalendarDateCell) => {
    const day = getFormattedDate(text, type);
    return {
        isSelected: day.isSame(props.selectedDay),
        type: `${type}-month`,
        day: day.format('YYYY-MM-DD'),
        date: day.toDate()
    };
};

const getCellClass = ({ text, type }: CalendarDateCell) => {
    const classes: string[] = [type];
    if (type === 'current') {
        const date = getFormattedDate(text, type);
        if (date.isSame(props.selectedDay, 'day')) {
            classes.push(bemDay.is('selected', true));
        }
        if (date.isSame(now, 'day')) {
            classes.push(bemDay.is('today', true));
        }
    }
    return classes;
};

const handlePickDay = ({ text, type }: CalendarDateCell) => {
    const date = getFormattedDate(text, type);
    emits('pick', date);
};
</script>
