<template>
    <form :class="[bem.b()]">
        <slot></slot>
    </form>
</template>

<script setup lang="ts">
import { createNamespace } from '@mealcomes/utils';
import { FormContext, formContextKey, formProps } from './form';
import { provide } from 'vue';
import { FormItemContext } from './form-item';
import { ValidateFieldsError } from 'async-validator';

defineOptions({
    name: 'mc-form'
});

const bem = createNamespace('form');
const props = defineProps(formProps);

// form 收集 form-item 的 context
const fields: FormItemContext[] = [];
const addField: FormContext['addField'] = context => {
    fields.push(context);
};
const context = {
    ...props,
    addField
};
provide(formContextKey, context);

const validate = async (
    callback?: (valid: boolean, fields?: ValidateFieldsError) => void
) => {
    let errors: ValidateFieldsError = {};
    // 对内部 form-item 组件依次进行表单项校验
    for (let field of fields) {
        try {
            await field.validate('');
        } catch (err) {
            errors = {
                ...errors,
                ...(err as ValidateFieldsError)
            };
        }
    }
    if (Object.keys(errors).length === 0) {
        // 内部 form-item 校验全部通过
        return callback?.(true);
    } else {
        // 内部 form-item 校验存在错误
        if (callback) {
            return callback?.(false, errors);
        } else {
            return Promise.reject(errors);
        }
    }
};

defineExpose({
    validate
});
</script>
