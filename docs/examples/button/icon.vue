<template>
    <div>
        <mc-button type="primary">
            <template #icon>
                <AddCircle></AddCircle>
            </template>
        </mc-button>
        <mc-button type="primary">
            <template #icon>
                <AddCircle></AddCircle>
            </template>
        </mc-button>
        <mc-button type="primary">
            <template #icon>
                <AddCircle></AddCircle>
            </template>
        </mc-button>
        <mc-button type="primary">
            Add
            <template #icon>
                <AddCircle></AddCircle>
            </template>
        </mc-button>
        <mc-button type="primary" icon-placement="right">
            Add
            <template #icon>
                <AddCircle></AddCircle>
            </template>
        </mc-button>
    </div>
</template>

<script setup lang="ts">
import { AddCircle } from '@vicons/ionicons5';
</script>
