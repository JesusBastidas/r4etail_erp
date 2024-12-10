<script setup lang="ts">
import NavBarHorizontal from '@/components/admin/NavBarHorizontal.vue';
import { useRoute, useRouter } from 'vue-router';

/* data */
const route = useRouter();
const router = useRoute();
</script>
<template>
    <div>
        <nav-bar-horizontal />
    </div>
    <div class="mt-[50px]">
        <slot></slot> 
        <!-- aqui pongo los componentes que se modifican -->
    </div>
</template>