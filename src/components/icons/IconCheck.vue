<script setup lang="ts">
const props = defineProps({
    
    height: {
        type: String,
        default: '100%',
    },
    width: {
        type: String,
        default: '100%',
    },
    fill: {
        type: String,
        default: 'none',
    },
});
</script>

<template>
    <svg
        :width="props.width"
        :height="props.height"
        viewBox="0 0 68 52"
        :fill="props.fill"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        d="M22.6667 52.0002L0 29.8726L7.93333 22.1279L22.6667 36.5109L60.0667 0.000244141L68 7.74492L45.3333 29.8726L22.6667 52.0002Z"
        />
    </svg>
</template>
