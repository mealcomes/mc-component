import { withInstall } from '@mealcomes/utils';
import _Input from './src/input.vue';

export const McInput = withInstall(_Input);

export default McInput;

export type { InputProps } from './src/input';

declare module 'vue' {
    export interface GlobalComponents {
        McInput: typeof McInput;
    }
}
