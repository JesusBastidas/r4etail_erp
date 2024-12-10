<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import NavBarVertical from '@/components/clients/modales/NavBarVertical.vue';
import NavBarHorizontal from '@/components/clients/modales/NavBarHorizontal.vue';

/* data */
const route = useRouter();
const router = useRoute();
</script>

<template>
    <div class="flex">
        <div>
            <nav-bar-vertical />
        </div>

        <div class="w-full">
            <nav-bar-horizontal  class="ml-[50px] mr-[50px]" />
            <slot></slot> 
            <!-- aqui pongo los componentes que se modifican -->
        </div>
    </div>
</template>