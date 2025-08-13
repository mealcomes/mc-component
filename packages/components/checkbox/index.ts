import { withInstall } from '@mealcomes/utils';
import _CheckBox from './src/checkbox.vue';

export const McCheckbox = withInstall(_CheckBox);

export default McCheckbox;

export * from './src/checkbox';

declare module 'vue' {
    export interface GlobalComponents {
        McCheckbox: typeof McCheckbox;
    }
}
