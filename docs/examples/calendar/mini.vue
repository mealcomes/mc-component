<template>
    <div class="vp-raw" :style="{ width: '300px' }">
        <mc-calendar v-model="value" mini />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(new Date());
</script>
