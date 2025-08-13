import { withInstall } from '@mealcomes/utils';
import _VirtualList from './src/virtual-list';

export const McVirtualScrollList = withInstall(_VirtualList);

export default McVirtualScrollList;

export type { VirtualProps } from './src/props';

declare module 'vue' {
    export interface GlobalComponents {
        McVirtualScrollList: typeof McVirtualScrollList;
    }
}
