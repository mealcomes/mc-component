import { withInstall } from '@mealcomes/utils';
import _Calendar from './src/calendar.vue';

export const McCalendar = withInstall(_Calendar);

export default McCalendar;

export type * from './src/calendar';
export * from './src/calendar';

declare module 'vue' {
    export interface GlobalComponents {
        McCalendar: typeof McCalendar;
    }
}
