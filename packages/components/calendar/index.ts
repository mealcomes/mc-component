import { withInstall } from '@mealcomes/utils';
import _Calendar from './src/calendar.vue';

const Calendar = withInstall(_Calendar);

export default Calendar;

export type * from './src/calendar';
export * from './src/calendar';

declare module 'vue' {
    export interface GlobalComponents {
        McCalendar: typeof Calendar;
    }
}
