import { withInstall } from '@mealcomes/utils';
import _Virtual from './src/virtual-list';

const Virtual = withInstall(_Virtual);

export default Virtual;

declare module 'vue' {
    export interface GlobalComponents {
        MCVirtual: typeof Virtual;
    }
}
