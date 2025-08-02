<template>
    <div
        :class="[bem.b()]"
        @click="handleClick"
        @keydown.self.enter.space="handleKeydown"
    >
        <template v-if="drag">
            <upload-dragger @file="uploadFiles" :directory="directory">
                <slot />
            </upload-dragger>
        </template>
        <template v-else>
            <slot />
        </template>
        <input
            ref="inputRef"
            type="file"
            :class="bem.e('input')"
            :name="name"
            :accept="accept"
            :multiple="multiple"
            @change="handleChange"
        />
    </div>
</template>
<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import {
    genFileId,
    UploadFile,
    UploadRawFile,
    UploadRequestOptions
} from './upload';
import { ref, shallowRef } from 'vue';
import { UploadContentProps, uploadContentProps } from './upload-content';
import UploadDragger from './upload-dragger.vue';
import { httpRequest } from './ajax';
import { readDirectory } from './utils';

defineOptions({
    name: 'mc-upload-content',
    inheritAttrs: false
});
const bem = createNamespace('upload');
const props = defineProps(uploadContentProps);
const inputRef = ref<HTMLInputElement>();
const requests = shallowRef<Record<string, XMLHttpRequest | Promise<unknown>>>(
    {}
);

/**
 * 文件上传
 */
const uploadFiles = (files: File[]) => {
    if (files.length === 0) return;

    const { autoUpload, limit, fileList, multiple, onStart, onExceed } = props;

    if (limit && fileList.length + files.length > limit) {
        onExceed(files, fileList);
        return;
    }

    if (!multiple) {
        files = files.slice(0, 1);
    }

    for (const file of files) {
        const rawFile = file as UploadRawFile;
        if (rawFile.isDirectory) {
            if (props.directory) {
                uploadDirectory(rawFile);
            }
            continue;
        }
        rawFile.uid = genFileId();
        // 在 upload 组件中对原始文件进行封装并存入 uploadFiles 列表中
        onStart(rawFile);
        if (autoUpload) upload(rawFile);
    }
};

const uploadDirectory = (dir: UploadRawFile) => {
    const entry = dir.entry;
    readDirectory(entry)
        .then(files => {
            for (const file of files) {
                const rawFile = file as UploadRawFile;
                rawFile.uid = genFileId();
                // 在 upload 组件中对原始文件进行封装并存入 uploadFiles 列表中
                props.onStart(rawFile);
                if (props.autoUpload) upload(rawFile);
            }
        })
        .catch((e: Error) => {
            console.warn('read directory error: ', e.message);
        });
};

const upload = async (rawFile: UploadRawFile): Promise<void> => {
    inputRef.value!.value = '';

    if (!props.beforeUpload) {
        return doUpload(rawFile);
    }

    let hookResult: Exclude<
        ReturnType<UploadContentProps['beforeUpload']>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Promise<any>
    >;
    try {
        hookResult = await props.beforeUpload(rawFile);
    } catch {
        hookResult = false;
    }
    if (hookResult === false) {
        // 取消上传的时候需要从 upload 组件的 uploadFile 列表中移除该文件信息
        props.onRemove(rawFile);
        return;
    }

    doUpload(rawFile);
};

const doUpload = async (rawFile: UploadRawFile) => {
    const {
        headers,
        data,
        method,
        name: filename,
        action,
        onProgress,
        onSuccess,
        onError
    } = props;

    const { uid } = rawFile;
    const options: UploadRequestOptions = {
        headers: headers || {},
        file: rawFile,
        data,
        method,
        filename,
        action,
        onProgress: evt => {
            onProgress(evt, rawFile);
        },
        onSuccess: res => {
            onSuccess(res, rawFile);
            delete requests.value[uid];
        },
        onError: err => {
            onError(err, rawFile);
            delete requests.value[uid];
        }
    };
    const request = httpRequest(options);
    requests.value[uid] = request;
    if (request instanceof Promise) {
        request.then(options.onSuccess, options.onError);
    }
};

const handleChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    uploadFiles(Array.from(files));
};

const handleClick = () => {
    inputRef.value!.value = '';
    inputRef.value!.click();
};

const handleKeydown = () => {
    handleClick();
};

/**
 * 请求取消函数
 */
const abort = (file?: UploadFile) => {
    const _reqs = Object.entries(requests.value).filter(
        file ? ([uid]) => String(file.uid) === uid : () => true
    );
    _reqs.forEach(([uid, req]) => {
        if (req instanceof XMLHttpRequest) req.abort();
        delete requests.value[uid];
    });
};

defineExpose({
    abort,
    upload
});
</script>
