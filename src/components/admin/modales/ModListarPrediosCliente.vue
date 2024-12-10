<script setup lang="ts">
import { ref, onMounted } from 'vue';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import { decryptDatos } from '@/stores/hub';

/* data */
const props = defineProps({
    close: { type: Function },
    icoType: { type: String },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    onCancel: { type: Function },
    sendPredios: { type: Function, default: ()=>{} },
    sendNumPredios: { type: Function, default: ()=>{} },
    });

const avaliablePredios = ref<Predio[]>();
const prediosList = ref<Number[]>([]);
const numPrediosElegidos = ref<Number>();

/* interface */

interface Predio {
    id: number;
    predio_name: string;
    location: string;
    available_area: string;
    use_agreement_signed: boolean;
    difficult_clearing: boolean;
    difficult_access: boolean;
    height_predio_mts: string;
    predio_type: string;
    contact_name: string;
    contact_phone: string;
    available_trees: number;
    created_by: User;
    updated_by: User;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    email: string;
    name: string | null;
    user_type: string;
    is_active: boolean;
}

/* methods */

const prediosElegidos = () => {
    numPrediosElegidos.value =  prediosList.value.length;
}

const getPredios = async () => {
    try {
        const response = await usersApi.get('/manager/predios/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        avaliablePredios.value = response.data;
    } catch (error) {
        console.log(error);
    }
}

// Function to handle predio checkbox change
function handlePredioCheckboxChange(predioId: number): void {
    if (prediosList.value.includes(predioId)) {
        prediosList.value = prediosList.value.filter((id) => id !== predioId);
    } else {
        prediosList.value.push(predioId);
    }
}

const enviarArray = () => {
    props.sendPredios(prediosList.value);
    props.sendNumPredios(numPrediosElegidos.value);
    props.close()
}

/* lifestyle */

onMounted( async () => {
    await getPredios();
});

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#89858533] p-4 z-50">
        <div class="p-4 pb-6 rounded-3xl min-w-[400px] max-w-[800px]" :class="`bg-white`">
            <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
            </div>
            <h1 class="w-full text-center my-4 text-2xl" :class="`text-green-900`" v-if="props.title">
                {{ props.title }}
            </h1>
            <p class="w-full text-center my-4 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                {{ props.subTitle }}
            </p>
            <div>
                <div>
                    <div class="flex justify-between mb-2">
                        <p>Nombre</p>
                        <p>Ubicacion</p>
                    </div>
                    <div>
                        <div class="flex flex-col" v-for="predio in avaliablePredios">
                            <div class="flex justify-between content-center">
                                <div class="flex justify-between content-center mr-10">
                                    <input class="mr-2" type="checkbox" @change="handlePredioCheckboxChange(predio.id), prediosElegidos()">
                                    <p class="font-semibold text-green-700">{{ predio.predio_name }}</p>
                                </div>
                                <p>{{ predio.location }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex">
                <button class="w-full mt-4" :class="`text-green-700`" v-if="props.onClick" @click="enviarArray()">Aceptar</button>
                <button class="w-full mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel()">
                Cancelar
                </button>
            </div>
        </div>
    </div>
</template>
