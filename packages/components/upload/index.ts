import { withInstall } from '@mealcomes/utils';
import _Upload from './src/upload.vue';

export const McUpload = withInstall(_Upload);

export default McUpload;

export type * from './src/upload';
export * from './src/upload';

declare module 'vue' {
    export interface GlobalComponents {
        McUpload: typeof McUpload;
    }
}
