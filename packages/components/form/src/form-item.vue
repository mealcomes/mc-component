<template>
    <div
        :class="[
            bem.b(),
            bem.is('error', validateState === 'error'),
            bem.is('validating', validateState === 'validating'),
            bem.is('success', validateState === 'success'),
            bem.m(size)
        ]"
    >
        <div :class="[bem.e('label-wrap')]" v-if="hasLabel">
            <label :class="[bem.e('label')]" :style="labelStyle">
                <slot name="label">
                    {{ label }}
                </slot>
            </label>
        </div>
        <div :class="[bem.e('content')]" :style="contentStyle">
            <slot></slot>
            <slot v-if="shouldShowError" name="error" :error="validateMessage">
                <div :class="[bem.e('error')]">
                    {{ validateMessage }}
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { addUnit, createNamespace } from '@mealcomes/utils';
import {
    computed,
    inject,
    onMounted,
    provide,
    ref,
    useSlots
} from 'vue';
import type { CSSProperties } from 'vue';
import {
    formItemContextKey,
    formItemProps,
} from './form-item';
import type {
    FormItemContext,
    FormItemRule,
    FormItemValidateState
} from './form-item';
import { formContextKey } from './form';
import { convertArray } from './utils';
import AsyncValidator from 'async-validator';
import type { FormValidateFailure } from './error';

const bem = createNamespace('form-item');
defineOptions({
    name: 'mc-form-item'
});
const props = defineProps(formItemProps);
const formContext = inject(formContextKey);
const slots = useSlots();

const validateState = ref<FormItemValidateState>('error');
const validateMessage = ref('');
const shouldShowError = computed(
    () =>
        validateState.value === 'error' && // 表单项校验通过时不展示错误信息
        props.showMessage
);
const _rules = computed(() => {
    const thisRules: FormItemRule[] = convertArray(props.rules);
    // 合并上级的 form 组件传入的 rules
    const formRules = formContext?.rules;
    if (formRules && props.prop) {
        const formRule = formRules[props.prop];
        if (formRule) {
            thisRules.push(...convertArray(formRule));
        }
    }
    return thisRules;
});
const labelStyle = computed<CSSProperties>(() => {
    const labelWidth = addUnit(props.labelWidth || '');

    if (labelWidth) return { width: labelWidth };
    return {};
});
const contentStyle = computed<CSSProperties>(() => {
    if (!props.label && !props.labelWidth) {
        return {};
    }
    const labelWidth = addUnit(props.labelWidth || '');
    if (!props.label && !slots.label) {
        return { marginLeft: labelWidth };
    }
    return {};
});
const hasLabel = computed<boolean>(() => {
    return !!(props.label || slots.label);
});

/**
 * 获取包含指定 trigger 的规则
 */
function getRuleFiltered(trigger: string) {
    const rules = _rules.value;
    return rules.filter(rule => {
        if (!rule.trigger || !trigger) return true;
        if (Array.isArray(rule.trigger)) {
            return rule.trigger.includes(trigger);
        } else {
            return rule.trigger === trigger;
        }
    });
}

function setValidationState(state: FormItemValidateState) {
    validateState.value = state;
}

function onValidationSucceeded() {
    setValidationState('success');
}

function onValidationFailed(error: FormValidateFailure) {
    const { errors, fields } = error;
    if (!errors || !fields) {
        console.error(error);
    }
    setValidationState('error');

    validateMessage.value = errors
        ? errors?.[0]?.message ?? `${props.prop} is required`
        : '';
}

/**
 * 表单项校验函数
 */
const doValidate = async (rules: FormItemRule[]) => {
    const modelName = props.prop;
    const validator = new AsyncValidator({
        [modelName]: rules
    });
    const model = formContext?.model || {};

    /*
    这里一定要返回啊！！！
    不然返回的就是 new Promise.resolve(undefined) 了
    那后续就没有 catch 了
    */
    return validator
        .validate({
            [modelName]: model[modelName]
        })
        .then(() => {
            onValidationSucceeded();
            return true as const;
        })
        .catch((err: FormValidateFailure) => {
            onValidationFailed(err);
            return Promise.reject(err);
        });
};

const validate: FormItemContext['validate'] = async (trigger, callback?) => {
    const hasCallback = typeof callback === 'function';

    const rules = getRuleFiltered(trigger);
    if (rules.length === 0) {
        callback?.(true);
        return true;
    }

    setValidationState('validating');

    return doValidate(rules)
        .then(() => {
            callback?.(true);
            return true as const;
        })
        .catch((err: FormValidateFailure) => {
            const { fields } = err;
            callback?.(false, fields);
            return hasCallback ? false : Promise.reject(fields);
        });
};

const context: FormItemContext = {
    ...props,
    validate
};

// 给内部组件提供自己的上下文
// 例如: 内部的 input 组件可以拿到该上下文，
// 并在 blur 或 change 的时候调用上下文中的 validate 函数
provide(formItemContextKey, context);

onMounted(() => {
    // 将自己的 context 传递给上层 form 组件
    formContext?.addField(context);
});
</script>
