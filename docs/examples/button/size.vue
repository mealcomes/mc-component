<template>
    <div :style="{ marginBottom: '1rem' }">
        <mc-button size="large">Large</mc-button>
        <mc-button>Default</mc-button>
        <mc-button size="small">Small</mc-button>
        <mc-button size="large">
            <template #icon>
                <Search />
            </template>
            Search
        </mc-button>
        <mc-button>
            <template #icon>
                <Search />
            </template>
            Search
        </mc-button>
        <mc-button size="small">
            <template #icon>
                <Search />
            </template>
            Search
        </mc-button>
    </div>
    <div :style="{ marginBottom: '1rem' }">
        <mc-button size="large" round>Large</mc-button>
        <mc-button round>Default</mc-button>
        <mc-button size="small" round>Small</mc-button>
        <mc-button size="large" round>
            <template #icon>
                <Search />
            </template>
            Search
        </mc-button>
        <mc-button round>
            <template #icon>
                <Search />
            </template>
            Search
        </mc-button>
        <mc-button size="small" round>
            <template #icon>
                <Search />
            </template>
            Search
        </mc-button>
    </div>
    <div>
        <mc-button size="large" circle>
            <template #icon>
                <Search />
            </template>
        </mc-button>
        <mc-button circle>
            <template #icon>
                <Search />
            </template>
        </mc-button>
        <mc-button size="small" circle>
            <template #icon>
                <Search />
            </template>
        </mc-button>
    </div>
</template>

<script setup lang="ts">
import { Search } from '@vicons/ionicons5';
</script>
