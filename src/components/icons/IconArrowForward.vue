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
    <svg :width="props.width" :height="props.height" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="arrow_forward">
            <mask id="mask0_249_1294" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" :width="props.width" :height="props.height">
                <rect id="Bounding box" :width="props.width" :height="props.height" :fill="props.fill"/>
            </mask>
            <g mask="url(#mask0_249_1294)">
                <path id="arrow_forward_2" d="M12.4702 9.56277H3.9375C3.77789 9.56277 3.64424 9.50892 3.53655 9.40123C3.42885 9.29355 3.375 9.1599 3.375 9.00028C3.375 8.84067 3.42885 8.70702 3.53655 8.59933C3.64424 8.49165 3.77789 8.4378 3.9375 8.4378H12.4702L8.59326 4.56087C8.48172 4.44933 8.42668 4.3188 8.42813 4.16929C8.42956 4.01977 8.48846 3.88683 8.60481 3.7705C8.72114 3.66185 8.85287 3.6056 8.99998 3.60175C9.14709 3.5979 9.27882 3.65415 9.39516 3.7705L14.1504 8.52578C14.2206 8.59597 14.2701 8.67 14.299 8.74789C14.3278 8.82577 14.3423 8.9099 14.3423 9.00028C14.3423 9.09067 14.3278 9.1748 14.299 9.25268C14.2701 9.33057 14.2206 9.4046 14.1504 9.47479L9.39516 14.2301C9.29132 14.3339 9.16272 14.387 9.00936 14.3894C8.85599 14.3918 8.72114 14.3387 8.60481 14.2301C8.48846 14.1137 8.43028 13.9801 8.43028 13.8291C8.43028 13.6782 8.48846 13.5445 8.60481 13.4282L12.4702 9.56277Z" :fill="props.fill"/>
            </g>
        </g>
    </svg>
</template>
