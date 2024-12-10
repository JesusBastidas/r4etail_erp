<script setup lang="ts">

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="loadership_ZUPTU">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<style scoped>

.loadership_ZUPTU {
        display: flex;
        position: relative;
        width: 61px;
        height: 13px;
    }
.loadership_ZUPTU div {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #042b13;
    top: 0px;          
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.loadership_ZUPTU div:nth-child(1) {
    left: 0px;
    animation: loadership_ZUPTU_scale_up 0.6s infinite;
}
.loadership_ZUPTU div:nth-child(2) {
    left: 0px;
    animation: loadership_ZUPTU_translate 0.6s infinite;
}
.loadership_ZUPTU div:nth-child(3) {
    left: 24px;
    animation: loadership_ZUPTU_translate 0.6s infinite;
}
.loadership_ZUPTU div:nth-child(4) {
    left: 48px;
    animation: loadership_ZUPTU_scale_down 0.6s infinite;
}
@keyframes loadership_ZUPTU_scale_up {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes loadership_ZUPTU_scale_down {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
@keyframes loadership_ZUPTU_translate {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(24px, 0);
    }
}
</style>