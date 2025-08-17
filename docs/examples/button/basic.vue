<template>
    <div :style="{ marginBottom: '1rem' }">
        <mc-button type="default">Default</mc-button>
        <mc-button type="primary">Primary</mc-button>
        <mc-button type="success">Success</mc-button>
        <mc-button type="info">Info</mc-button>
        <mc-button type="warning">Warning</mc-button>
        <mc-button type="danger">Danger</mc-button>
    </div>

    <div :style="{ marginBottom: '1rem' }">
        <mc-button type="default" plain>Default</mc-button>
        <mc-button type="primary" plain>Primary</mc-button>
        <mc-button type="success" plain>Success</mc-button>
        <mc-button type="info" plain>Info</mc-button>
        <mc-button type="warning" plain>Warning</mc-button>
        <mc-button type="danger" plain>Danger</mc-button>
    </div>

    <div :style="{ marginBottom: '1rem' }">
        <mc-button round type="default">Round</mc-button>
        <mc-button round type="primary">Primary</mc-button>
        <mc-button round type="success">Success</mc-button>
        <mc-button round type="info">Info</mc-button>
        <mc-button round type="warning">Warning</mc-button>
        <mc-button round type="danger">Danger</mc-button>
    </div>

    <div>
        <mc-button circle type="default">
            <template #icon>
                <AddCircle />
            </template>
        </mc-button>
        <mc-button circle type="primary">
            <template #icon>
                <AddCircle />
            </template>
        </mc-button>
        <mc-button circle type="success">
            <template #icon>
                <AddCircle />
            </template>
        </mc-button>
        <mc-button circle type="info">
            <template #icon>
                <AddCircle />
            </template>
        </mc-button>
        <mc-button circle type="warning">
            <template #icon>
                <AddCircle />
            </template>
        </mc-button>
        <mc-button circle type="danger">
            <template #icon>
                <AddCircle />
            </template>
        </mc-button>
    </div>
</template>

<script setup lang="ts">
import { AddCircle } from '@vicons/ionicons5';
</script>
