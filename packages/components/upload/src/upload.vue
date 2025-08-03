<template>
    <div>
        <mc-upload-content ref="uploadRef" v-bind="uploadContentProps">
            <slot></slot>
        </mc-upload-content>
    </div>
</template>
<script setup lang="ts">
import { UploadFile, UploadFiles, uploadProps, UploadRawFile } from './upload';
import { computed, ref, watch } from 'vue';
import { UploadContentInstance, UploadContentProps } from './upload-content';
import McUploadContent from './upload-content.vue';

defineOptions({
    name: 'mc-upload'
});
const props = defineProps(uploadProps);
const emits = defineEmits({
    'update:file-list': (files: UploadFiles) => files instanceof Array
});
const uploadRef = ref<UploadContentInstance>();

/**
 * 文件列表，在 onStart 钩子中加入待上传的文件
 */
const uploadFiles = ref<UploadFiles>(props.fileList);
watch(uploadFiles, newVal => {
    emits('update:file-list', newVal);
});

const getFile = (rawFile: UploadRawFile) => {
    return uploadFiles.value.find(file => file.uid === rawFile.uid);
};

/**
 * 终止文件上传
 */
function abort(file: UploadFile) {
    uploadRef.value?.abort(file);
}

/**
 * 上传文件
 */
function submit() {
    uploadFiles.value
        .filter(({ status }) => status === 'ready')
        .forEach(({ raw }) => raw && uploadRef.value?.upload(raw));
}

const uploadContentProps = computed<UploadContentProps>(() => ({
    ...props,
    /**
     * 正式开始往后端传文件之前会将包装后的文件信息存入 uploadFiles 列表中
     */
    onStart: rawFile => {
        const uploadFile: UploadFile = {
            uid: rawFile.uid,
            name: rawFile.name,
            percentage: 0,
            raw: rawFile,
            size: rawFile.size,
            status: 'ready'
        };
        if (props.listType === 'picture-card' || props.listType === 'picture') {
            try {
                uploadFile.url = URL.createObjectURL(rawFile);
            } catch (err: unknown) {
                console.warn((err as Error).message);
                props.onError(err as Error, uploadFile, uploadFiles.value);
            }
        }
        uploadFiles.value = [...uploadFiles.value, uploadFile];
        props.onChange(uploadFile, uploadFiles.value);
    },
    onProgress: (event, rawFile) => {
        const file = getFile(rawFile);
        if (!file) return;

        props.onProgress(event, file, uploadFiles.value);
        file.status = 'uploading';
        file.percentage = Math.round(event.percent);
    },
    onSuccess: (res, rawFile) => {
        const file = getFile(rawFile);
        if (!file) return;

        file.status = 'success';
        file.response = res;
        props.onSuccess(res, file, uploadFiles.value);
        props.onChange(file, uploadFiles.value);
    },
    onError: (err, rawFile) => {
        const file = getFile(rawFile);
        if (!file) return;

        console.error(err);
        file.status = 'fail';
        uploadFiles.value = uploadFiles.value.filter(
            uploadFile => uploadFile.uid !== file.uid
        );
        props.onError(err, file, uploadFiles.value);
        props.onChange(file, uploadFiles.value);
    },
    onRemove: async rawFile => {
        const uploadFile = getFile(rawFile);
        if (!uploadFile) throw new Error('file to be removed not found');

        const doRemove = (file: UploadFile) => {
            abort(file);
            uploadFiles.value = uploadFiles.value.filter(
                uploadFile => uploadFile.uid !== file.uid
            );
            props.onRemove(file, uploadFiles.value);
        };

        if (props.beforeRemove) {
            const before = await props.beforeRemove(
                uploadFile,
                uploadFiles.value
            );
            if (before !== false) doRemove(uploadFile);
        } else {
            doRemove(uploadFile);
        }
    }
}));

defineExpose({
    /** 取消上传请求 */
    abort,
    /** 上传文件列表 */
    submit
});
</script>
