<template>
    <div :class="bem.b()">
        <mc-form-item
            :prop="prop"
            :label-width="labelWidth"
            :rules="rules"
            :show-message="showMessage"
            :size="size"
        >
            <mc-input
                :type="type"
                :model-value="modelValue"
                :clearable="clearable"
                :show-password="showPassword"
                :disabled="disabled"
                :readonly="readonly"
                :aria-label="ariaLabel"
                :autocomplete="autocomplete"
                @input="handleInput"
                @change="handleChange"
                @blur="handleBlur"
                @focus="handleFocus"
                @keydown="handleKeyDown"
            >
                <template v-if="$slots.prefix" #prefix>
                    <slot name="prefix"></slot>
                </template>
                <template v-if="$slots.suffix" #suffix>
                    <slot name="suffix"></slot>
                </template>
                <template v-if="$slots.prepend" #prepend>
                    <slot name="prepend"></slot>
                </template>
                <template v-if="$slots.append" #append>
                    <slot name="append"></slot>
                </template>
            </mc-input>
            <span ref="labelRef" :class="bem.e('form-label')">{{
                placeholder
            }}</span>
        </mc-form-item>
    </div>
</template>

<script setup lang="ts">
import { formItemInputEmits, formItemInputProps } from './form-item-input';
import McFormItem from '../form-item.vue';
import McInput from '@mealcomes/components/input';
import { createNamespace } from '@mealcomes/utils';
import { computed, onMounted, ref, watch } from 'vue';

defineOptions({
    name: 'mc-form-item-input'
});
const props = defineProps(formItemInputProps);
const emits = defineEmits(formItemInputEmits);
const bem = createNamespace('form-item-input');

const isInputFocus = ref(false);

const labelRef = ref<HTMLSpanElement>();
const labelWidth = ref<number | string>(0);
let labelActiveWidth: number | string;
const isLabelActive = computed(() => {
    return props.modelValue !== '';
});
const placeholderLeft = computed(() =>
    props.size === 'default' || !props.size
        ? '11px'
        : props.size === 'large'
        ? '15px'
        : '7px'
);
const placeholderLineHeight = computed(() =>
    props.size === 'default' || !props.size
        ? '32px'
        : props.size === 'large'
        ? '40px'
        : '24px'
);

const handleInput = (value: string) => {
    emits('input', value);
    emits('update:modelValue', value);
};

const handleChange = (value: string) => {
    emits('change', value);
};

const handleFocus = (event: FocusEvent) => {
    isInputFocus.value = true;
    emits('focus', event);
};

const handleBlur = (event: FocusEvent) => {
    isInputFocus.value = false;
    emits('blur', event);
};

const handleKeyDown = (event: KeyboardEvent) => {
    emits('keydown', event);
};

function setLabelRefStatus(isActive: boolean) {
    const add = isActive ? 'active' : 'inactive';
    const remove = !isActive ? 'active' : 'inactive';
    labelRef.value!.classList.add(add);
    labelRef.value!.classList.remove(remove);

    const width = isActive ? labelActiveWidth : '0';

    labelWidth.value = width;
}

function getLabelWidth(targetClass: string): Promise<number> {
    return new Promise(res => {
        const clone = labelRef.value!.cloneNode(true) as HTMLElement;

        clone.style.visibility = 'hidden';
        clone.style.pointerEvents = 'none';
        clone.style.zIndex = '-999';

        labelRef.value?.parentElement?.appendChild(clone);

        requestAnimationFrame(() => {
            clone.classList.add(targetClass);
            clone.addEventListener(
                'transitionend',
                () => {
                    const width = clone.getBoundingClientRect().width;

                    labelRef.value?.parentElement?.removeChild(clone);
                    res(width);
                },
                { once: true }
            );
        });
    });
}

onMounted(async () => {
    if (props.labelWidth) {
        labelActiveWidth = props.labelWidth;
    } else {
        labelActiveWidth = await getLabelWidth('active');
        labelActiveWidth = `${labelActiveWidth + 10}px`;
    }
    watch(
        () => isLabelActive.value || isInputFocus.value,
        (newVal: boolean) => {
            setLabelRefStatus(newVal || isInputFocus.value);
        },
        {
            immediate: true
        }
    );
});
</script>

<style lang="scss">
.mc-form-item {
    position: relative;
}

.mc-form-item-input__form-label {
    position: absolute;
    font-size: inherit;
    font-weight: inherit;
    left: v-bind(placeholderLeft);
    height: 100%;
    line-height: v-bind(placeholderLineHeight);
    color: var(--mc-text-color-placeholder);
    transition: all 0.3s ease;
    transform-origin: 0 50%;
    user-select: none;
    pointer-events: none;

    &.active {
        transform: translate(calc(0px - v-bind(placeholderLeft))) scale(1.1);
        font-size: var(--mc-form-label-font-size);
        color: var(--mc-text-color-primary);
    }

    &.inactive {
        font-size: var(--font-size);
        color: var(--mc-text-color-placeholder);
    }
}

.mc-form-item__content {
    position: static;
    transition: all 0.3s ease;

    .mc-form-item__error {
        transition: left 0.3s ease;
        left: auto;
    }
}
</style>
