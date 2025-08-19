<template>
    <div class="vp-raw">
        <mc-calendar class="vp-raw" v-model="value">
            <template #date-cell="{ data }">
                <p
                    :class="data.isSelected ? 'is-selected' : ''"
                    :style="{
                        height: '100%',
                        margin: '0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }"
                >
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '✔️' : '' }}
                </p>
            </template>
        </mc-calendar>

        <mc-calendar class="vp-raw" v-model="value" mini>
            <template #date-cell="{ data }">
                <p
                    :class="data.isSelected ? 'is-selected' : ''"
                    :style="{ margin: '0' }"
                >
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '✔️' : '' }}
                </p>
            </template>
        </mc-calendar>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(new Date());
</script>

<style scoped>
.is-selected {
    font-size: 15px;
    font-weight: 600;
}
</style>
