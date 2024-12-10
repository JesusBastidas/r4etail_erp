<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const singleDirectorData = ref<Director>({
    id: 0,
    photo: '',
    name: '',
    identification: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    department: '',
    start_date: '',
    user: 0,
});
const spinner = ref<Boolean>(false);


const props = defineProps({
    close: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    directorId: { type: Number },
    });

/* interfaces */

interface Director {
    id: number;
    photo: string;
    name: string;
    identification: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    department: string;
    start_date: string;
    user: number;
}

/* methods */

const getSingleDirector = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.get(`/manager/director-operations/${props.directorId}/`,{
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        singleDirectorData.value = res.data;
    } catch (error: any) {
        spinner.value = false;
        showToast('No se pudo obtener la información del director', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
};

const deleteDirector = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.delete(`/manager/director-operations/${props.directorId}/`,{
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        showToast('Director desactivado', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onCancel();
    } catch (error: any) {
        spinner.value = false;
        showToast('No se pudo eliminar el director', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
};


/* onMounted */

onMounted( async () => {
    await getSingleDirector();
})

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[300px] min-h-[370px]" :class="`bg-white`">
            <div class="flex">
                <h1 class="w-full text-start mb-2 mt-2 text-lg font-semibold" :class="`text-green-600`" v-if="props.title">
                    {{ props.title }}
                </h1>
                <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
            </div>
            <p class="w-full text-start my-2 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                {{ props.subTitle }}
            </p>
            <div>
                <div class="flex">
                    <div class="mx-2">
                        <div class="mb-2">
                            <p class="mb-2">Nombre completo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" disabled placeholder="Director" v-model="singleDirectorData.name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Correo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" disabled placeholder="email" v-model="singleDirectorData.email">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Dirección</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" disabled placeholder="Dirección" v-model="singleDirectorData.address">
                        </div>
                        <div class="mb-2 w-full">
                            <p class="mb-2">Foto Director</p>
                            <a :href="singleDirectorData.photo" target="_blank" class="outline-none border rounded-[35px] px-2 py-1">
                                {{ 'Foto del director' }}
                            </a>
                        </div>
                    </div>
                    <div class="mx-2">
                        <div class="mb-2">
                            <p class="mb-2">Cédula</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" disabled placeholder="Identificación" v-model="singleDirectorData.identification">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Teléfono móvil</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" disabled placeholder="Móvil" v-model="singleDirectorData.phone">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Ciudad</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" disabled placeholder="Ciudad" v-model="singleDirectorData.city">
                        </div>
                        <div>
                            <p class="mb-2">Departamento</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" disabled placeholder="Departamento" v-model="singleDirectorData.department">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="props.onClick()">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="deleteDirector()">Desactivar Director</button>
            </div>
            <div>
                <spinner v-if="spinner"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

</style>
