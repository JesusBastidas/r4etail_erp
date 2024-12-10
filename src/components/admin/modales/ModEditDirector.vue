<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const userPhoto = ref<File | null>(null);
const spinner = ref<Boolean>(false);
const singleDirectorData = ref<Director>({
    name: '',
    identification: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    department: '',
});

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
    name: string;
    identification: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    department: string;

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
    } catch (error) {
        spinner.value = false;
        showToast('No se pudo obtener la información del director', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const editDirector = async () => {
    const formData = new FormData();
    formData.append('name', singleDirectorData.value.name);
    formData.append('identification', singleDirectorData.value.identification);
    formData.append('phone', singleDirectorData.value.phone);
    formData.append('address', singleDirectorData.value.address);
    formData.append('email', singleDirectorData.value.email);
    formData.append('city', singleDirectorData.value.city);
    formData.append('department', singleDirectorData.value.department);
    if (userPhoto.value) {
        formData.append('photo', userPhoto.value);
    }
    try {
        spinner.value = true;
        const response = await usersApi.patch(`/manager/director-operations/${props.directorId}/`, 
            formData,
            {
            headers: {
                    Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
                },
        });
        spinner.value = false;
        showToast('Cambios guardados exitosamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onClick();
    } catch (error: any) {
        spinner.value = false;
        showToast('No se pudo editar la información del director', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

onMounted( async () => {
    await getSingleDirector();
})

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[250px] min-h-[370px]" :class="`bg-white`">
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
                        <div>
                            <p>Nombre completo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Director" v-model="singleDirectorData.name">
                        </div>
                        <div>
                            <p>Correo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="email" v-model="singleDirectorData.email">
                        </div>
                        <div>
                            <p>Dirección</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Dirección" v-model="singleDirectorData.address">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Foto director</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> userPhoto=files[0]" />
                            </div>
                        </div>
                    </div>
                    <div class="mx-2">
                        <div>
                            <p>Cédula</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Identificación" v-model="singleDirectorData.identification">
                        </div>
                        <div>
                            <p>Celular</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Movil" v-model="singleDirectorData.phone">
                        </div>
                        <div>
                            <p>Ciudad</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Ciudad" v-model="singleDirectorData.city">
                        </div>
                        <div>
                            <p>Departamento</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Departamento" v-model="singleDirectorData.department">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="editDirector">{{props.butText}}</button>
                <button class="px-4 mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
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