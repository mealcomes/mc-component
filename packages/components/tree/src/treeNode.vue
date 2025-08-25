<template>
    <div
        :class="[
            bem.b(),
            bem.is('selected', selected),
            bem.is('disabled', node.disabled)
        ]"
        :style="{ height: `${size}px`, lineHeight: `${size}px` }"
    >
        <span
            :class="bem.b('indent')"
            :style="{ width: `${node.level * 24}px` }"
        ></span>
        <span
            :class="[
                bem.e('expand-icon'),
                { expanded: expanded && !node.isLeaf },
                bem.is('leaf', node.isLeaf)
            ]"
            @click="handleExpand"
        >
            <MCIcon :class="bem.e('switcher')" size="16">
                <Switcher v-if="!loading" />
                <Loading v-else />
            </MCIcon>
        </span>
        <mc-checkbox
            v-if="showCheckbox"
            style="margin: 0 3px"
            :model-value="checked"
            :disabled="disabled"
            :indeterminate="indeterminate"
            @change="handleCheckChange"
        ></mc-checkbox>
        <span :class="bem.e('content')" @click="handleSelected">
            <MCTreeNodeContent :node="node"></MCTreeNodeContent>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { treeNodeEmits, treeNodeProps } from './tree';
import MCIcon from '@mealcomes/components/icon';
import Switcher from '@mealcomes/components/internal-icon/switcher';
import Loading from '@mealcomes/components/internal-icon/loading';
import MCTreeNodeContent from './tree-node-content';
import McCheckbox from '@mealcomes/components/checkbox';
import { computed } from 'vue';

const bem = createNamespace('tree-node');

const props = defineProps(treeNodeProps);
const emit = defineEmits(treeNodeEmits);

function handleExpand() {
    emit('toggle', props.node);
}

const loading = computed(() => props.loadingKeys.has(props.node.key));

const selected = computed(
    () =>
        !props.node.disabled &&
        !props.showCheckbox &&
        props.selectedKeys.includes(props.node.key)
);

function handleSelected(e: MouseEvent) {
    if (props.node.disabled || props.showCheckbox) return;
    emit('select', props.node, e.ctrlKey);
}

function handleCheckChange(val: boolean) {
    emit('check', props.node, val);
}
</script>
