<template>
    <div :class="bem.b()">
        <MCVirtualList
            v-if="!!height"
            :items="flattenTree"
            :size="itemSize"
            :height="height"
        >
            <template #default="{ node }">
                <MCTreeNode
                    :class="bem.is('multiple', multiple)"
                    :key="node.key"
                    :node="node"
                    :expanded="isExpanded(node)"
                    :loadingKeys="loadingKeysRef"
                    :selectedKeys="selectKeysRef"
                    :show-checkbox="showCheckbox"
                    :checked="isChecked(node)"
                    :disabled="isDisabled(node)"
                    :indeterminate="isIndeterminate(node)"
                    :size="itemSize"
                    @toggle="toggleExpand"
                    @check="toggleCheck"
                    @select="handleSelect"
                >
                </MCTreeNode>
            </template>
        </MCVirtualList>
        <MCTreeNode
            v-else
            v-for="node in flattenTree"
            :class="bem.is('multiple', multiple)"
            :key="treeOptions.getKey(node)"
            :node="node"
            :expanded="isExpanded(node)"
            :loadingKeys="loadingKeysRef"
            :selectedKeys="selectKeysRef"
            :show-checkbox="showCheckbox"
            :checked="isChecked(node)"
            :disabled="isDisabled(node)"
            :indeterminate="isIndeterminate(node)"
            :size="itemSize"
            @toggle="toggleExpand"
            @check="toggleCheck"
            @select="handleSelect"
        >
        </MCTreeNode>
    </div>
</template>

<script setup lang="ts">
import { provide, useSlots } from 'vue';
import { treeEmits, treeInjectKey, treeProps } from './tree';
import { createNamespace } from '@mealcomes/utils';
import MCTreeNode from './treeNode.vue';
import MCVirtualList from '@mealcomes/components/virtual-list';
import { useTree } from './useTree';

const bem = createNamespace('tree');

defineOptions({
    name: 'mc-tree'
});
const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);

const {
    flattenTree,
    loadingKeysRef,
    selectKeysRef,
    treeOptions,
    isExpanded,
    toggleExpand,
    handleSelect,
    isChecked,
    isDisabled,
    isIndeterminate,
    toggleCheck,
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedKeys,
    getHalfCheckedNodes
} = useTree(props, emit);

provide(treeInjectKey, {
    slots: useSlots()
});

defineExpose({
    /** @description 当前选中节点 `key` 的数组 */
    getCheckedKeys,
    /** @description 当前选中节点的数组 */
    getCheckedNodes,
    /** @description 当前半选中的节点的 `key` 所组成的数组 */
    getHalfCheckedKeys,
    /** @description 当前半选中的节点组成的数组 */
    getHalfCheckedNodes
});
</script>
