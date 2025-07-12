<template>
    <i :class="bem.b()" :style="style">
        <slot></slot>
    </i>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import { computed } from 'vue';
import { iconProps } from './icon';

const bem = createNamespace('icon');

defineOptions({
    name: 'm-icon'
});

const props = defineProps(iconProps);

// 计算属性来计算一个样式
const style = computed(() => {
    if (!props.size && !props.color) {
        return {};
    }
    return {
        ...(props.size ? { 'font-size': props.size + 'px'} : {}),
        ...(props.color ? { 'color': props.color } : {}),
    }
})

</script>
