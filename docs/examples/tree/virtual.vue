<template>
    <mc-tree class="vp-raw" :data="data" :height="100"> </mc-tree>
</template>

<script setup lang="ts">
const getKey = (prefix: string, id: number) => {
    return `${prefix}-${id}`;
};

const createData = (
    maxDeep: number,
    maxChildren: number,
    minNodesNumber: number,
    deep = 1,
    key = 'node'
) => {
    let id = 0;
    return Array.from({ length: minNodesNumber })
        .fill(deep)
        .map(() => {
            const childrenNumber =
                deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren);
            const nodeKey = getKey(key, ++id);
            return {
                key: nodeKey,
                label: nodeKey,
                children: childrenNumber
                    ? createData(
                          maxDeep,
                          maxChildren,
                          childrenNumber,
                          deep + 1,
                          nodeKey
                      )
                    : undefined
            };
        });
};

const data = createData(4, 30, 40);
</script>
