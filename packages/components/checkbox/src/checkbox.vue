<template>
    <label :class="[bem.b('wrapper'), bem.is('checked', model as boolean), bem.is('disabled', disabled)]">
        <span :class="[
            bem.b(), bem.is('checked', model as boolean),
            bem.is('disabled', disabled)]">
            <input type="checkbox" v-model="model" ref="inputRef" :disabled="disabled" :value="label"
                @change="handleChange">
            <span :class="bem.m('inner')"></span>
        </span>
        <span v-if="$slots.default || label">
            <slot />
            <template v-if="!$slots.default">{{ label }}</template>
        </span>
    </label>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { checkboxEmits, checkboxProps } from './checkbox';
import { computed, onMounted, ref, watch } from 'vue';

const bem = createNamespace('checkbox');
const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);

defineOptions({
    name: 'mc-checkbox'
})

const model = computed({
    get() {
        return props.modelValue;
    },
    set(val: string | number | boolean) {
        if (props.disabled) {
            return;
        }
        emit('update:modelValue', val);
    }
})

const inputRef = ref<HTMLInputElement>()
function indeterminate(val: boolean) {
    inputRef.value!.indeterminate = val;
}
watch(() => props.indeterminate, indeterminate);

onMounted(() => {
    indeterminate(props.indeterminate);
})

function handleChange(e: Event) {
    if (props.disabled) return;
    const target = e.target as HTMLInputElement;
    emit('change', target.checked);
}
</script>