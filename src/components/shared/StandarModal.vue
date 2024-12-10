<script setup lang="ts">
/* import IcoClose from '@/assets/img/icons/IcoClose.vue';
import IcoCheck from '@/assets/img/icons/IcoCheck.vue';
 */
import IconClose from '@/components/icons/IconClose.vue';

const props = defineProps({
    close: { type: Function },
    icoType: { type: String },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    onCancel: { type: Function },
    });
</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#89858533] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[250px] max-w-[350px]" :class="`bg-white`">
            <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
            </div>
            <ico-check class-name="mx-auto my-4" width="68px" height="52px" v-if="icoType == 'success'" />
            <ico-close class-name="mx-auto my-4" width="50px" height="50px" v-if="icoType == 'error'" />
            <h1 class="w-full text-center my-4 text-2xl" :class="`text-green-900`" v-if="props.title">
                {{ props.title }}
            </h1>
            <p class="w-full text-center my-4 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                {{ props.subTitle }}
            </p>
            <div class="flex">
                <button class="w-full mt-4" :class="`text-green-700`" v-if="props.onClick" @click="props.onClick()">Aceptar</button>
                <button class="w-full mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
            </div>
        </div>
    </div>
</template>
