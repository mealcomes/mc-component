import { withInstall } from '@mealcomes/utils';
import _CheckBox from './src/checkbox.vue';

const CheckBox = withInstall(_CheckBox);

export default CheckBox;

export * from './src/checkbox';

declare module 'vue' {
    export interface GlobalComponents {
        McCheckbox: typeof CheckBox
    }
}