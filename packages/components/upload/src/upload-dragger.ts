import { ExtractPropTypes } from 'vue';
import type UploadDragger from './upload-dragger.vue';

/**
 * upload-dragger 组件 props
 */
export const uploadDraggerProps = {
    directory: {
        type: Boolean,
        default: false
    },
    accept: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
};

/**
 * upload-dragger 组件 props 类型
 */
export type UploadDraggerProps = ExtractPropTypes<typeof uploadDraggerProps>;

/**
 * upload-dragger 组件 emits
 */
export const uploadDraggerEmits = {
    /**
     * 拖拽上传文件事件
     */
    file: (file: File[]) => Array.isArray(file)
};

/**
 * upload-dragger 组件 emits 类型
 */
export type UploadDraggerEmits = typeof uploadDraggerEmits;

/**
 * upload-dragger 组件实例类型
 */
export type UploadDraggerInstance = InstanceType<typeof UploadDragger> &
    unknown;
