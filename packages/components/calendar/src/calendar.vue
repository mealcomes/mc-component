<template>
    <div :class="bem.b()">
        <div :class="bem.e('header')">
            <slot name="header" :data="selectedMonth">
                <div :class="bem.e('title')">
                    {{ selectedMonth }}
                </div>
                <div :class="bem.e('button-group')">
                    <mc-button size="small" @click="selectDate('prev-year')"
                        >前一年</mc-button
                    >
                    <mc-button size="small" @click="selectDate('prev-month')"
                        >上个月</mc-button
                    >
                    <mc-button size="small" @click="selectDate('today')"
                        >今天</mc-button
                    >
                    <mc-button size="small" @click="selectDate('next-month')"
                        >下个月</mc-button
                    >
                    <mc-button size="small" @click="selectDate('next-year')"
                        >后一年</mc-button
                    >
                </div>
            </slot>
        </div>
        <div v-if="!range" :class="bem.e('body')">
            <date-table
                :date="date"
                :selected-day="realSelectedDay"
                @pick="pickDay"
            >
                <template v-if="$slots['date-cell']" #date-cell="data">
                    <slot name="date-cell" v-bind="data" />
                </template>
            </date-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import McButton from '@mealcomes/components/button';
import { CalendarDateType, calendarEmits, calendarProps } from './calendar';
import { computed, ref } from 'vue';
import DateTable from './date-table.vue';
import dayjs, { Dayjs } from 'dayjs';

defineOptions({
    name: 'mc-calendar'
});

const bem = createNamespace('calendar');
const props = defineProps(calendarProps);
const emits = defineEmits(calendarEmits);

const now = dayjs();
const selectedDay = ref<Dayjs>();
const date = computed(() => {
    if (!props.modelValue) {
        return now;
    } else {
        return dayjs(props.modelValue);
    }
});
const selectedMonth = computed(
    () => `${date.value.year()} - ${date.value.format('M')}`
);

const realSelectedDay = computed<Dayjs | undefined>({
    get() {
        if (!props.modelValue) return selectedDay.value;
        return date.value;
    },
    set(val) {
        if (!val) return;
        selectedDay.value = val;
        const result = val.toDate();

        emits('update:modelValue', result);
    }
});

const pickDay = (day: Dayjs) => {
    realSelectedDay.value = day;
};

const prevMonthDayjs = computed(() => date.value.subtract(1, 'month').date(1));
const nextMonthDayjs = computed(() => date.value.add(1, 'month').date(1));
const prevYearDayjs = computed(() => date.value.subtract(1, 'year').date(1));
const nextYearDayjs = computed(() => date.value.add(1, 'year').date(1));
const selectDate = (type: CalendarDateType) => {
    const dateMap: Record<CalendarDateType, Dayjs> = {
        'prev-month': prevMonthDayjs.value,
        'next-month': nextMonthDayjs.value,
        'prev-year': prevYearDayjs.value,
        'next-year': nextYearDayjs.value,
        today: now
    };

    const day = dateMap[type];

    if (!day.isSame(date.value, 'day')) {
        pickDay(day);
    }
};

defineExpose({
    /** 当前选中的日期 */
    selectedDay: realSelectedDay,
    /** 选择指定的某一天 */
    pickDay,
    /** 选择日期 */
    selectDate
});
</script>
