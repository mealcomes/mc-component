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
import { onMounted, provide, useSlots } from 'vue';
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
    checkedKeysRef,
    selectKeysRef,
    treeOptions,
    isExpanded,
    toggleExpand,
    handleSelect,
    isChecked,
    isDisabled,
    isIndeterminate,
    toggleCheck,
    findNode,
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedKeys,
    getHalfCheckedNodes,
    getSelectedKeys,
    getSelectedNodes,
    getExpandedKeys,
    getExpandedNodes
} = useTree(props, emit);

provide(treeInjectKey, {
    slots: useSlots()
});

onMounted(() => {
    checkedKeysRef.value.forEach(key => {
        const node = findNode(key);
        if (node) {
            toggleCheck(node, true);
        }
    });
});

defineExpose({
    /** @description 当前 checkbox 选中节点的 `key` 数组 */
    getCheckedKeys,
    /** @description 当前 checkbox 选中节点的数组 */
    getCheckedNodes,
    /** @description 当前 checkbox 半选中的节点的 `key` 所组成的数组 */
    getHalfCheckedKeys,
    /** @description 当前 checkbox 半选中的节点组成的数组 */
    getHalfCheckedNodes,
    /** @description 当前选中节点的 `key` 数组 */
    getSelectedKeys,
    /** @description 当前选中节点的数组 */
    getSelectedNodes,
    /** @description 当前展开节点的 `key` 数组 */
    getExpandedKeys,
    /** @description 当前展开节点的数组 */
    getExpandedNodes
});
</script>
