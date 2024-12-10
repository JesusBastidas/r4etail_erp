<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { useAuthStore } from '@/stores/logVerify';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const trueEdit = ref<Boolean> (false) || undefined;
const authStore = useAuthStore();
const singleProperty = ref<properties[]>([]);
const spinner = ref<Boolean> (false);

const props = defineProps({
    close: { type: Function },
    forestType: { type: String },
    cambioBosque: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    predioId: { type: Number }
    });

/* interfaces */

interface User {
    id: number;
    email: string;
    name: string | null;
    user_type: string;
    is_active: boolean;
}

interface Property {
    id: number;
    client: number;
    client_name: string;
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
    longitude: string;
    latitude: string;
}

type properties = Property[];

/* methods */

const getProperties = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get(`/manager/predios/${props.predioId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        singleProperty.value = response.data;
    } catch (error: any) {
        spinner.value = false;
        showToast('No se pudo recuperar información del predio', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const editProperty = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.patch(`/manager/predios/${props.predioId}/`, singleProperty.value, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        showToast('Predio editado correctamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onClick();
    } catch (error: any) {
        spinner.value = false;
        showToast('Error al modificar el predio', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}


/* onMounted */

onMounted(async () => {
    authStore.userVerify();
    await getProperties();
})


</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[600px]" :class="`bg-white`">
            <div class="flex justify-between">
                <div class="flex">
                    <h1 class="text-start mb-2 mt-2 text-sm font-semibold" :class="`text-green-900`" v-if="props.title">
                        {{ singleProperty.client_name }}
                    </h1>
                </div>
                <div class="p-2 flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
            </div>
            <div class="flex border-b border-gray-400">
                <img src="@/assets/IconsSvg/IconUbicacion.svg">
                <p class="text-start text-sm" :class="`text-green-900`" v-if="props.subTitle">{{ singleProperty.predio_name }}</p>
            </div>
            <div>
                <div class="flex justify-between">
                    <div class="mx-2">
                        <div class="mb-2">
                            <p class="mb-2">Ubicación</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Ubicación" v-model="singleProperty.location">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Área disponible</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Área disponible" v-model="singleProperty.available_area">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Altitud del predio <br> (Mts sobre el nivel del mar)</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Altitud" v-model="singleProperty.height_predio_mts">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Longitud</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Longitud" v-model="singleProperty.longitude">
                        </div>
                    </div>
                    <div class="mx-2">
                        <div class="mb-2">
                            <p class="mb-2">Tipo de predio</p>
                            <!-- <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Tipo de predio" v-model="singleProperty.predio_type" value="{{ singleProperty.predio_type == 'public' ? 'Publico' : 'Privado' }}"> -->
                            <select class="outline-none border rounded-[35px] px-2 py-1 w-full" v-model="singleProperty.predio_type">
                                <option value="public">Público</option>
                                <option value="private">Privado</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Nombre del contacto</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Nombre del contacto" v-model="singleProperty.contact_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Telefono del contacto</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Nombre del contacto" v-model="singleProperty.contact_phone">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Árboles disponibles</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Árboles disponibles" v-model="singleProperty.available_trees">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Latitud</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Latitud" v-model="singleProperty.latitude">
                        </div>
                    </div>
                </div>
                <div class="text-sm my-4">
                    <div class="flex justify-between">
                        <p class="mr-6 text-green-800">Acuerdo con el dueño</p>
                        <div class="flex">
                            <div class="flex">
                                <input type="radio" v-model="singleProperty.use_agreement_signed" value="true" @change="singleProperty.use_agreement_signed = true">
                                <p class="ml-2 text-green-800">Si</p>
                            </div>
                            <div class="flex ml-4">
                                <input type="radio" v-model="singleProperty.use_agreement_signed" value="false" @change="singleProperty.use_agreement_signed = false">
                                <p class="ml-2 text-green-800">No</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <p class="mr-6 text-green-800">Difícil rocería</p>
                        <div class="flex">
                            <div class="flex">
                                <input type="radio" v-model="singleProperty.difficult_clearing" value="true" @change="singleProperty.difficult_clearing = true">
                                <p class="ml-2 text-green-800">Si</p>
                            </div>
                            <div class="flex ml-4">
                                <input type="radio" v-model="singleProperty.difficult_clearing" value="false" @change="singleProperty.difficult_clearing = false">
                                <p class="ml-2 text-green-800">No</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <p class="mr-6 text-green-800">Difícil acceso</p>
                        <div class="flex">
                            <div class="flex">
                                <input type="radio" v-model="singleProperty.difficult_access" value="true" @change="singleProperty.difficult_access = true">
                                <p class="ml-2 text-green-800">Si</p>
                            </div>
                            <div class="flex ml-4">
                                <input type="radio" v-model="singleProperty.difficult_access" value="false" @change="singleProperty.difficult_access = false">
                                <p class="ml-2 text-green-800">No</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-around">
                <button class="px-7 py-1 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="editProperty">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
            </div>
        </div>
        <div>
            <spinner v-if="spinner" />
        </div>
    </div>
</template>

<style scoped>

input[type="radio"] {
    accent-color: green;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

</style>
