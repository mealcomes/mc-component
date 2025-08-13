import { withInstall } from '@mealcomes/utils';
import _Tree from './src/tree.vue';

export const McTree = withInstall(_Tree);

export default McTree;
export * from './src/tree';

declare module 'vue' {
    export interface GlobalComponents {
        McTree: typeof McTree;
    }
}
