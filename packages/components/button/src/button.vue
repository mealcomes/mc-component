<template>
    <button
        :class="[
            bem.b(),
            bem.m(type),
            bem.m(size),
            bem.is('loading', loading),
            bem.is('disabled', disabled),
            bem.is('round', round),
            bem.is('circle', circle),
            bem.is('plain', plain)
        ]"
        :type="nativeType"
        :disabled="disabled || loading"
        @click="handleClick"
        @mousedown="handleMouseDown"
    >
        <template v-if="loading && iconPlacement === 'left'">
            <slot v-if="$slots.loading" name="loading" />
            <mc-Icon v-else>
                <component :is="Loading" />
            </mc-Icon>
        </template>
        <mc-icon v-else-if="$slots.icon && iconPlacement === 'left'">
            <component :is="$slots.icon" v-if="$slots.icon" />
            <slot v-else name="icon" />
        </mc-icon>
        <span v-if="$slots.default">
            <slot />
        </span>
        <template v-if="loading && iconPlacement === 'right'">
            <slot v-if="$slots.loading" name="loading" />
            <mc-icon v-else>
                <component :is="Loading" />
            </mc-icon>
        </template>
        <mc-icon v-else-if="$slots.icon && iconPlacement === 'right'">
            <component :is="$slots.icon" v-if="$slots.icon" />
            <slot v-else name="icon" />
        </mc-icon>
        <mc-wave ref="waveRef" v-if="waving"></mc-wave>
    </button>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { buttonEmits, buttonProps } from './button';
import Loading from '../../internal-icon/loading';
import McIcon from '@mealcomes/components/icon';
import McWave from '@mealcomes/components/_util/wave/wave.vue';
import type { WaveExpose } from '@mealcomes/components/_util/wave/wave';
import { nextTick, ref } from 'vue';

defineOptions({
    name: 'mc-button',
    inheritAttrs: false
});

const bem = createNamespace('button');
const props = defineProps(buttonProps);
const emits = defineEmits(buttonEmits);

const waving = ref(false);
const waveRef = ref<WaveExpose>();
// eslint-disable-next-line no-undef
let waveId: string | number | NodeJS.Timeout | undefined;

function clearWave() {
    if (waveId) {
        clearTimeout(waveId);
    }
}

function wave() {
    clearWave();
    waving.value = true;
    nextTick(() => {
        waveRef.value?.wave();
    });
    waveId = setTimeout(() => {
        waving.value = false;
    }, 1000);
}

function handleClick(event: MouseEvent) {
    if (props.loading) return;
    wave();
    emits('click', event);
}

function handleMouseDown(event: MouseEvent) {
    emits('mousedown', event);
}
</script>
