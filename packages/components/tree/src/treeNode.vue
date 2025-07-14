<template>
    <div :class="bem.b()">
        <span :class="bem.b('indent')" :style="{ width: `${node.level * 24}px` }"></span>
        <span :class="[bem.e('expand-icon'), { expanded: expanded && !node.isLeaf }, bem.is('leaf', node.isLeaf)]"
            @click="handleExpand">
            <z-icon :class="bem.e('switcher')" size="16" color="#1F1F1F">
                <Switcher v-if="!loading" />
                <Loading v-else />
            </z-icon>
        </span>
        <span :class="bem.e('content')">
            {{ node?.label }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { treeNodeEmits, treeNodeProps } from './tree';
import ZIcon from '@mealcomes/components/icon'
import Switcher from './icon/switcher'
import Loading from './icon/loading'
import { computed } from 'vue';

const bem = createNamespace('tree-node')

const props = defineProps(treeNodeProps);
const emit = defineEmits(treeNodeEmits);

function handleExpand() {
    emit('toggle', props.node);
}

const loading = computed(() => props.loadingKeys.has(props.node.key));

</script>