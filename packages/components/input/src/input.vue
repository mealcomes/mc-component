<template>
    <div
        :class="[
            bem.b(),
            {
                [bem.b('group')]: $slots.prepend || $slots.append,
                [bem.bm('group', 'append')]: $slots.append,
                [bem.bm('group', 'prepend')]: $slots.prepend
            }
        ]"
    >
        <div v-if="$slots.prepend" :class="[bem.be('group', 'prepend')]">
            <slot name="prepend"></slot>
        </div>

        <div :class="[bem.e('wrapper'), bem.is('focus', isFocused)]">
            <span v-if="$slots.prefix" :class="[bem.e('prefix')]">
                <span :class="[bem.e('prefix-inner')]">
                    <slot name="prefix"></slot>
                </span>
            </span>
            <input
                ref="inputRef"
                :type="
                    showPassword
                        ? passwordVisible
                            ? 'text'
                            : 'password'
                        : type
                "
                :placeholder="placeholder"
                :class="[bem.e('inner')]"
                v-bind="attrs"
                @input="handleInput"
                @change="handleChange"
                @blur="handleBlur"
                @focus="handleFocus"
            />
            <span v-if="$slots.suffix" :class="[bem.e('suffix')]">
                <span :class="[bem.e('suffix-inner')]">
                    <template v-if="!showClear || !showPwdVisible">
                        <slot name="suffix"></slot>
                    </template>
                    <mc-icon
                        :class="[bem.e('clear'), bem.e('icon')]"
                        v-if="showClear"
                        @click="handleClear"
                    >
                        <mc-close-circle />
                    </mc-icon>
                    <mc-icon
                        :class="[bem.e('password'), bem.e('icon')]"
                        v-if="showPwdVisible"
                        @click="handlePasswordVisible"
                    >
                        <mc-eye v-if="passwordVisible" />
                        <mc-eye-closed v-else />
                    </mc-icon>
                </span>
            </span>
        </div>

        <div v-if="$slots.append" :class="[bem.be('group', 'append')]">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import { inputEmits, inputProps } from './input';
import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue';
import McEye from '@mealcomes/components/internal-icon/eye';
import McEyeClosed from '@mealcomes/components/internal-icon/eye-closed';
import McCloseCircle from '@mealcomes/components/internal-icon/close-circle';

defineOptions({
    name: 'mc-input',
    inheritAttrs: false // 关闭默认继承属性
});
const attrs = useAttrs(); // 获取非 props 的属性，将其绑定在 input 上
const bem = createNamespace('input');
const props = defineProps(inputProps);
const emits = defineEmits(inputEmits);

const inputRef = ref<HTMLInputElement>();
const isFocused = ref(false);
watch(
    () => props.modelValue,
    () => {
        setNativeInputValue();
    }
);
function setNativeInputValue() {
    const inputEle = inputRef.value;
    if (!inputEle) return;

    inputEle.value = String(props.modelValue);
}

async function focus() {
    await nextTick(); // 重新获取焦点
    inputRef.value?.focus();
}

/* show-password */

const passwordVisible = ref(false);
function handlePasswordVisible() {
    passwordVisible.value = !passwordVisible.value;
    focus();
}

const showPwdVisible = computed(() => {
    return (
        !!props.modelValue &&
        props.showPassword &&
        !props.disabled &&
        !props.readonly
    );
});

/* clearable */

const showClear = computed(() => {
    return (
        !!props.modelValue &&
        !props.disabled &&
        !props.readonly &&
        props.clearable
    );
});

function handleClear() {
    emits('input', '');
    emits('update:modelValue', '');
    emits('clear');
    focus();
}

onMounted(() => {
    setNativeInputValue();
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('input', target.value);
    emits('update:modelValue', target.value);
};

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('change', target.value);
};

const handleFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emits('focus', event);
};

const handleBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emits('blur', event);
};
</script>
