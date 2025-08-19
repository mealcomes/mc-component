<template>
    <mc-calendar class="vp-raw" v-model="value"></mc-calendar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(new Date());
</script>
