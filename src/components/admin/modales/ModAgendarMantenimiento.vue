<script setup lang="ts">
import { ref } from 'vue';
import IconClose from '@/components/icons/IconClose.vue';

/* data */
const acuerdoOwner = ref<Boolean> (false) || undefined;
const roceria = ref<Boolean> (false) || undefined;
const acceso = ref<Boolean> (false) || undefined;

const props = defineProps({
    close: { type: Function },
    forestType: { type: String },
    cambioBosque: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    });

/* methods */




</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[400px]" :class="`bg-white`">
            <div class="flex justify-between">
                <div class="flex">
                    <h1 class="text-start mb-2 mt-2 text-sm font-semibold" :class="`text-green-900`" v-if="props.title">
                        {{ props.title }}
                    </h1>
                </div>
                <div class="p-2 flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
            </div>
            <div class="flex">
                <p class="text-start my-2 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                    {{ props.subTitle }}
                </p>
            </div>
            <div class="my-6">
                <div class="flex text-green-700">
                    <div class="mx-2">
                        <div class="mb-4">
                            <p>Predio</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Usuario">
                        </div>
                        <div>
                            <p>Fecha</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="date" placeholder="fecha">
                        </div>
                    </div>
                    <div>
                        <div class="mb-6">
                            <p>Tipo de mantenimiento</p>
                            <select name="" id="">
                                <option value="">Selecciona</option>
                                <option value="">Opt 1</option>
                                <option value="">Opt 2</option>
                                <option value="">Opt 3</option>
                            </select>
                        </div>
                        <div>
                            <p>Hora</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="time" placeholder="hora">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <p class="mr-6 text-green-800">Acuerdo con el dueño</p>
                <div class="flex">
                    <div class="flex">
                        <input type="radio" v-model="acuerdoOwner" value="true" @change="acuerdoOwner = true">
                        <p class="ml-2 text-green-800">Si</p>
                    </div>
                    <div class="flex ml-4">
                        <input type="radio" v-model="acuerdoOwner" value="false" @change="acuerdoOwner = false">
                        <p class="ml-2 text-green-800">No</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <p class="mr-6 text-green-800">Difícil rocería</p>
                <div class="flex">
                    <div class="flex">
                        <input type="radio" v-model="roceria" value="true" @change="roceria = true">
                        <p class="ml-2 text-green-800">Si</p>
                    </div>
                    <div class="flex ml-4">
                        <input type="radio" v-model="roceria" value="false" @change="roceria = false">
                        <p class="ml-2 text-green-800">No</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <p class="mr-6 text-green-800">Difícil acceso</p>
                <div class="flex">
                    <div class="flex">
                        <input type="radio" v-model="acceso" value="true" @change="acceso = true">
                        <p class="ml-2 text-green-800">Si</p>
                    </div>
                    <div class="flex ml-4">
                        <input type="radio" v-model="acceso" value="false" @change="acceso = false">
                        <p class="ml-2 text-green-800">No</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-around">
                <button class="px-7 py-1 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="props.onClick">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="props.onCancel">Desactivar cliente</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
input[type="radio"] {
    accent-color: green;
}

</style>

