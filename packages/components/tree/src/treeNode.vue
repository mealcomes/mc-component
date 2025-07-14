<template>
    <div :class="[bem.b(), bem.is('selected', selected), bem.is('disabled', node.disabled)]">
        <span :class="bem.b('indent')" :style="{ width: `${node.level * 24}px` }"></span>
        <span :class="[bem.e('expand-icon'), { expanded: expanded && !node.isLeaf }, bem.is('leaf', node.isLeaf)]"
            @click="handleExpand">
            <m-icon :class="bem.e('switcher')" size="16" color="#1F1F1F">
                <Switcher v-if="!loading" />
                <Loading v-else />
            </m-icon>
        </span>
        <span :class="bem.e('content')" @click="handleSelected">
            <MTreeNodeContent :node="node"></MTreeNodeContent>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { treeNodeEmits, treeNodeProps } from './tree';
import MIcon from '@mealcomes/components/icon'
import Switcher from './icon/switcher'
import Loading from './icon/loading'
import MTreeNodeContent from './tree-node-content'
import { computed } from 'vue';

const bem = createNamespace('tree-node')

const props = defineProps(treeNodeProps);
const emit = defineEmits(treeNodeEmits);

function handleExpand() {
    emit('toggle', props.node);
}

const loading = computed(() => props.loadingKeys.has(props.node.key));

const selected = computed(() => props.selectedKeys.includes(props.node.key));

function handleSelected(e: MouseEvent) {
    if (props.node.disabled) return;
    emit('select', props.node, e.ctrlKey);
}
</script>