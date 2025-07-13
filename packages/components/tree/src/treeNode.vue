<template>
    <div :class="bem.b()">
        <div :class="bem.e('content')" :style="{ paddingLeft: `${node.level * 16}px` }">
            <span :class="[bem.e('expand-icon'), { expanded: expanded && !node.isLeaf }, bem.is('leaf', node.isLeaf)]"
                @click="handleExpand">
                <z-icon size="16" color="#1F1F1F">
                    <Switcher></Switcher>
                </z-icon>
            </span>
            <span>
                {{ node?.label }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@mealcomes/utils';
import { treeNodeEmits, treeNodeProps } from './tree';
import ZIcon from '@mealcomes/components/icon'
import Switcher from './icon/switcher'

const bem = createNamespace('tree-node')

const props = defineProps(treeNodeProps);
const emit = defineEmits(treeNodeEmits);

function handleExpand() {
    emit('toggle', props.node);
}

</script>