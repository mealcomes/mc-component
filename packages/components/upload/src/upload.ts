import type { ExtractPropTypes, PropType } from 'vue';
import { UploadAjaxError } from './ajax';
import Upload from './upload.vue';

export const uploadListTypes = ['text', 'picture', 'picture-card'] as const;

// 文件 uid 生成
let fileId = 1;
export const genFileId = () => Date.now() + fileId++;

/**
 * 上传状态
 */
export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail';

/**
 * 上传进度事件
 */
export type UploadProgressEvent = ProgressEvent & { percent: number };

/**
 * 上传请求 option
 */
export interface UploadRequestOptions {
    action: string;
    method: string;
    data: Record<string, string | Blob | [Blob, string]>;
    filename: string;
    file: UploadRawFile;
    headers: Headers | Record<string, string | number | null | undefined>;
    onError: (evt: UploadAjaxError) => void;
    onProgress: (evt: UploadProgressEvent) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response: any) => void;
}

/**
 * 封装上传的文件
 */
export interface UploadFile {
    uid?: number;
    name: string;
    url?: string;
    percentage?: number;
    raw?: UploadRawFile;
    size?: number;
    status: UploadStatus;
    response?: unknown;
}

export type UploadFiles = UploadFile[];

/**
 * upload 组件基本 props
 */
export const uploadBaseProps = {
    /**
     * 文件列表
     */
    fileList: {
        type: Array as PropType<UploadFiles>,
        default: () => [] as const
    },
    /**
     * 上传目标地址
     */
    action: {
        type: String,
        default: ''
    },
    /**
     * 是否可以多上传
     */
    multiple: {
        type: Boolean,
        default: false
    },
    /**
     * 上传的文件字段名
     */
    name: {
        type: String,
        default: 'file'
    },
    /**
     * 可接受的文件类型
     */
    accept: {
        type: String,
        default: ''
    },
    /**
     * 请求方法
     */
    method: {
        type: String,
        default: 'post'
    },
    /**
     * 请求头
     */
    headers: {
        type: Object,
        default: () => ({})
    },
    /**
     * 	上传时附带的额外参数
     */
    data: {
        type: Object,
        default: () => ({})
    },
    /**
     * 是否自动上传文件
     */
    autoUpload: {
        type: Boolean,
        default: true
    },
    /**
     * 文件列表的类型
     */
    listType: {
        type: String,
        values: uploadListTypes,
        default: 'text'
    },
    /**
     * 	允许上传文件的最大数量
     */
    limit: {
        type: Number
    },
    /**
     * 是否启用拖拽上传
     */
    drag: {
        type: Boolean,
        default: false
    },
    /**
     * 是否支持上传文件夹
     */
    directory: {
        type: Boolean,
        default: false
    },
    /**
     * 是否禁用
     */
    disabled: {
        type: Boolean,
        default: false
    }
} as const;

/**
 * 原始文件类型
 */
export type UploadRawFile = File & {
    uid: number;
    // isDirectory?: boolean;
    // entry: FileSystemDirectoryEntry;
};

/**
 * upload 组件 props
 */
export const uploadProps = {
    ...uploadBaseProps,
    /**
     * 上传文件之前的钩子
     */
    beforeUpload: {
        type: Function as PropType<
            (file: UploadRawFile) => Promise<boolean> | boolean
        >,
        default: () => {}
    },
    /**
     * 点击文件列表中已上传的文件时的钩子
     */
    onPreview: {
        type: Function as PropType<(file: UploadFile) => void>,
        default: () => {}
    },
    /**
     * 文件状态改变钩子, 添加文件、上传成功和上传失败时都会被调用
     */
    onChange: {
        type: Function as PropType<
            (file: UploadFile, uploadFiles: UploadFiles) => void
        >,
        default: () => {}
    },
    /**
     * 删除文件之前的钩子
     */
    beforeRemove: {
        type: Function as PropType<
            (
                file: UploadFile,
                uploadFiles: UploadFiles
            ) => Promise<boolean> | boolean
        >,
        default: () => {}
    },
    /**
     * 文件上传时的钩子
     */
    onProgress: {
        type: Function as PropType<
            (
                evt: UploadProgressEvent,
                uploadFile: UploadFile,
                uploadFiles: UploadFiles
            ) => void
        >,
        default: () => {}
    },
    /**
     * 文件列表移除文件时的钩子
     */
    onRemove: {
        type: Function as PropType<
            (file: UploadFile, uploadFiles: UploadFiles) => void
        >,
        default: () => {}
    },
    /**
     * 文件上传成功时的钩子
     */
    onSuccess: {
        type: Function as PropType<
            (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response: any,
                uploadFile: UploadFile,
                uploadFiles: UploadFiles
            ) => void
        >,
        default: () => {}
    },
    /**
     * 文件上传失败时的钩子
     */
    onError: {
        type: Function as PropType<
            (
                error: Error,
                uploadFile: UploadFile,
                uploadFiles: UploadFiles
            ) => void
        >,
        default: () => {}
    },
    /**
     * 当超出限制时，执行的钩子函数
     */
    onExceed: {
        type: Function as PropType<
            (files: File[], uploadFiles: UploadFile[]) => void
        >,
        default: () => {}
    }
} as const;

export type UploadProps = ExtractPropTypes<typeof uploadProps>;

/**
 * upload 组件实例
 */
export type UploadInstance = InstanceType<typeof Upload> & unknown;
