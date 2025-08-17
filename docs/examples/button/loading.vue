<template>
    <mc-button type="primary" loading>Loading</mc-button>
    <mc-button type="primary" loading>
        Loading
        <template #loading>
            <Refresh class="reload" />
        </template>
    </mc-button>
    <mc-button type="primary" loading>
        Loading
        <template #loading>
            <div class="custom-loading">
                <svg class="circular">
                    <circle class="circle" cx="8" cy="8" r="7"></circle>
                </svg>
            </div>
        </template>
    </mc-button>
</template>

<script lang="ts" setup>
import { Refresh } from '@vicons/ionicons5';
</script>

<style scoped>
.reload {
    width: 16px;
    height: 16px;
    margin-right: 3px;
    animation: loading-rotate 1s linear infinite;
    transform-origin: 50% 59.76%;
}

.mc-button .custom-loading .circular {
    width: 16px;
    height: 16px;
    fill: none;
    margin-right: 6px;
    animation: loading-rotate 2s linear infinite;
}
.mc-button .custom-loading .circular .circle {
    stroke-dasharray: 44, 44;
    stroke-dashoffset: 0;
    stroke-width: 1;
    stroke: var(--mc-button-text-color);
    stroke-linecap: round;
    animation: loading-dash 2s linear infinite;
}
@keyframes loading-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes loading-dash {
    0% {
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dashoffset: -44px;
    }
    100% {
        stroke-dashoffset: -88px;
    }
}
</style>
