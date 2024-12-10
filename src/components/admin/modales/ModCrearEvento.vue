<script setup lang="ts">
import { ref } from 'vue';
import ModalCreateEvent from '@/components/shared/modales/ModalCreateEvent.vue';

/* data */

const openModal = ref<Boolean>(false);


const props = defineProps({
    tittle:{
        type: String,
        required: false,
    },
    recargarAgenda:{
        type: Function,
        required: true,
    }
})
</script>

<template>
    <div class="w-[524px] h-[59px] px-[23px] pt-5 pb-[21px] bg-white rounded-[50px] justify-center items-center inline-flex">
        <div class="grow shrink basis-0 self-stretch justify-between items-center inline-flex">
            <div class="text-emerald-900 text-lg font-semibold tracking-[3.24px]">{{props.tittle}}</div>
            <div class="justify-start items-center gap-0.5 flex bg-green-800 text-white px-3 rounded-[35px] py-1 cursor-pointer" @click="openModal = true">
                <p>Crear evento</p>
            </div>
        </div>
    </div>
    <div>
        <modal-create-event v-if="openModal" :closeModal="()=>openModal=false" :addEvent="()=>{}" :recargarAgenda="props.recargarAgenda"/>
    </div>
</template>