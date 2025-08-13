<template>
    <div
        :class="[bem.b('dragger'), bem.is('dragover', dragover)]"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragover"
        @dragleave.prevent="onDragleave"
    >
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import { ref } from 'vue';
import type { UploadRawFile } from './upload';
import { uploadDraggerEmits, uploadDraggerProps } from './upload-dragger';
import attrAccept from './attr-accept';
import { readDirectory } from './utils';

defineOptions({
    name: 'mc-upload-dragger'
});
const emits = defineEmits(uploadDraggerEmits);
const props = defineProps(uploadDraggerProps);
const bem = createNamespace('upload');
const dragover = ref(false);

const traverseFileTree = (entry: FileSystemDirectoryEntry): Promise<File[]> => {
    return new Promise(resolve => {
        readDirectory(entry)
            .then(files => {
                resolve(files);
            })
            .catch((e: Error) => {
                console.warn('read directory error: ', e.message);
            });
    });
};

const onDrop = async (e: DragEvent) => {
    if (props.disabled) return;

    dragover.value = false;
    e.stopPropagation();

    const files = Array.from(e.dataTransfer!.files) as UploadRawFile[];
    const handledFiles: UploadRawFile[] = [];

    // 允许拖拽文件夹的时候才进行文件夹处理
    // 否则直接进行后续的 accept 过滤
    if (props.directory) {
        const items = e.dataTransfer!.items || [];
        for (let i = 0; i < files.length; i++) {
            const item = items[i];
            const entry = item?.webkitGetAsEntry?.();
            if (entry) {
                const subFiles = await traverseFileTree(
                    entry as FileSystemDirectoryEntry
                );
                handledFiles.push(...(subFiles as UploadRawFile[]));
            } else {
                console.warn(
                    'API webkitGetAsEntry is unsupported in you Browser'
                );
                alert('当前浏览器不支持拖拽读取文件夹!');
            }
        }
    } else {
        handledFiles.push(...files);
    }

    // 对文件进行过滤(当不允许文件夹上传时文件夹会被过滤)
    const acceptedFiles = handledFiles.filter((file: File) =>
        attrAccept(file as UploadRawFile, props.accept)
    );

    emits('file', acceptedFiles);
};

const onDragover = () => {
    if (!props.disabled) dragover.value = true;
};

const onDragleave = (e: DragEvent) => {
    if (!(e.currentTarget as Element).contains(e.relatedTarget as Element)) {
        dragover.value = false;
    }
};
</script>
