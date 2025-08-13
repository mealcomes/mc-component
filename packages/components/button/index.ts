import { withInstall } from '@mealcomes/utils';
import _Button from './src/button.vue';

export const McButton = withInstall(_Button);

export default McButton;

export * from './src/button';

declare module 'vue' {
    export interface GlobalComponents {
        McButton: typeof McButton
    }
}