<template>
    <button :class="[
        bem.b(),
        bem.m(type),
        bem.m(size),
        bem.is('loading', loading),
        bem.is('disabled', disabled),
        bem.is('round', round),

    ]" :type="nativeType" :disabled="disabled || loading" @click="handleClick" @mousedown="handleMouseDown">
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
    </button>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { buttonEmits, buttonProps } from './button';
import Loading from '../../internal-icon/loading';
import McIcon from '@mealcomes/components/icon'

defineOptions({
    name: 'mc-button',
    inheritAttrs: false
})

const bem = createNamespace('button');
const props = defineProps(buttonProps);
const emits = defineEmits(buttonEmits);

function handleClick(event: MouseEvent) {
    if (props.loading) return;
    emits('click', event);
}

function handleMouseDown(event: MouseEvent) {
    emits('mousedown', event);
}
</script>
