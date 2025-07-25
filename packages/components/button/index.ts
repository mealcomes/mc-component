import { withInstall } from '@mealcomes/utils';
import _Button from './src/button.vue';

const Button = withInstall(_Button);

export default Button;

export * from './src/button';

declare module 'vue' {
    export interface GlobalComponents {
        MCButton: typeof Button
    }
}