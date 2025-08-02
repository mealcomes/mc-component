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
import { UploadRawFile } from './upload';
import { uploadDraggerEmits, uploadDraggerProps } from './upload-dragger';

defineOptions({
    name: 'mc-upload-dragger'
});
const emits = defineEmits(uploadDraggerEmits);
const props = defineProps(uploadDraggerProps);
const bem = createNamespace('upload');
const dragover = ref(false);

const onDrop = (e: DragEvent) => {
    dragover.value = false;
    e.stopPropagation();
    const files = Array.from(e.dataTransfer!.files) as UploadRawFile[];
    const items = e.dataTransfer!.items || [];
    files.forEach((file, index) => {
        const item = items[index];
        const entry = item?.webkitGetAsEntry?.();
        if (entry) {
            file.isDirectory = entry.isDirectory;
            if (props.directory && entry.isDirectory) {
                file.entry = entry as FileSystemDirectoryEntry;
            }
        }
    });
    emits('file', files);
};

const onDragover = () => {
    dragover.value = true;
};

const onDragleave = (e: DragEvent) => {
    if (!(e.currentTarget as Element).contains(e.relatedTarget as Element)) {
        dragover.value = false;
    }
};
</script>
