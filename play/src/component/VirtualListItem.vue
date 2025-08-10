<template>
    <div class="item" style="font-size: 18px" :data-index="source.index">
        <div class="head">
            <span>{{ source.id }}</span>
            <span>{{ source.name }}</span>
        </div>
        <div class="body">{{ source.desc }}</div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    source: {
        type: Object,
        default: () => ({})
    }
});
</script>
