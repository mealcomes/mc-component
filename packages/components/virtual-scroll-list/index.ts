import { withInstall } from '@mealcomes/utils';
import _VirtualList from './src/virtual-list';

const VirtualList = withInstall(_VirtualList);

export default VirtualList;

export type { VirtualProps } from './src/props';

declare module 'vue' {
    export interface GlobalComponents {
        McVirtualScrollList: typeof VirtualList;
    }
}
