<template>
    <div class="vp-raw">
        <mc-calendar>
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

        <mc-calendar mini>
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

<style scoped>
.is-selected {
    font-size: 15px;
    font-weight: 600;
}
</style>
