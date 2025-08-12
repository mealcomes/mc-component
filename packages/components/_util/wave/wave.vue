<template>
    <div ref="waveRef" :class="[bem.b()]"></div>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import { ref } from 'vue';
import { WaveExpose } from './wave';

defineOptions({
    name: 'mc-wave',
})

const bem = createNamespace('wave');

const waveRef = ref<HTMLElement>();
let waveId: number | undefined;
function wave() {
    if (waveId) {
        clearTimeout(waveId);
    }
    waveRef.value?.classList.remove(bem.is('waving', true));
    void document.body.offsetHeight;
    waveRef.value?.classList.add(bem.is('waving', true));
    waveId = setTimeout(() => {
        waveRef.value?.classList.remove(bem.is('waving', true));
    }, 400);
}
defineExpose<WaveExpose>({
    wave
})

</script>
