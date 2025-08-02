import { withInstall } from '@mealcomes/utils';
import _Upload from './src/upload.vue';

const Upload = withInstall(_Upload);

export default Upload;

export type * from './src/upload';
export * from './src/upload';


declare module 'vue' {
    export interface GlobalComponents {
        McUpload: typeof Upload;
    }
}
