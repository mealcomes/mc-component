<template>
    <mc-calendar class="vp-raw" ref="calendar">
        <template #header="{ date }">
            <div
                :style="{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexGrow: '1'
                }"
            >
                <div>
                    <span>当前月份:</span>
                    <span>{{ date }}</span>
                </div>
                <div>
                    <mc-button size="small" @click="selectDate('prev-year')">
                        上一年
                    </mc-button>
                    <mc-button size="small" @click="selectDate('prev-month')">
                        上个月
                    </mc-button>
                    <mc-button size="small" @click="selectDate('today')">
                        今天
                    </mc-button>
                    <mc-button size="small" @click="selectDate('next-month')">
                        下个月
                    </mc-button>
                    <mc-button size="small" @click="selectDate('next-year')">
                        下一年
                    </mc-button>
                </div>
            </div>
        </template>
    </mc-calendar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { CalendarDateType, CalendarInstance } from 'mealcomes';

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return;
    calendar.value.selectDate(val);
};
</script>
