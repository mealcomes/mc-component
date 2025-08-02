import { ExtractPropTypes, PropType } from 'vue';
import {
    uploadBaseProps,
    UploadFile,
    UploadProgressEvent,
    uploadProps,
    UploadRawFile
} from './upload';
import UploadContent from './upload-content.vue'

/**
 * upload-content 组件 props
 */
export const uploadContentProps = {
    ...uploadBaseProps,
    beforeUpload: uploadProps['beforeUpload'],
    onStart: {
        type: Function as PropType<(rawFile: UploadRawFile) => void>,
        default: () => {}
    },
    onProgress: {
        type: Function as PropType<
            (e: UploadProgressEvent, rawFile: UploadRawFile) => void
        >,
        default: () => {}
    },
    onRemove: {
        type: Function as PropType<(rawFile: UploadRawFile) => void>,
        default: () => {}
    },
    onSuccess: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: Function as PropType<(res: any, rawFile: UploadRawFile) => void>,
        default: () => {}
    },
    onError: {
        type: Function as PropType<
            (err: Error, rawFile: UploadRawFile) => void
        >,
        default: () => {}
    },
    onExceed: {
        type: Function as PropType<
            (files: File[], uploadFiles: UploadFile[]) => void
        >,
        default: () => {}
    }
} as const;

/**
 * upload-content 组件 props 类型
 */
export type UploadContentProps = ExtractPropTypes<typeof uploadContentProps>;

export type UploadContentInstance = InstanceType<typeof UploadContent> & unknown