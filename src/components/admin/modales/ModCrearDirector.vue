<script setup lang="ts">
import { ref } from 'vue';
import { showToast, POSITION } from '@/stores/toast';
import { decryptDatos } from '@/stores/hub';
import IconClose from '@/components/icons/IconClose.vue';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const userPhoto = ref<File | null>(null);
const spinner = ref<Boolean>(false);
const directorDataCreate = ref<Director>({
    name: '',
    identification: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    department: '',
});

const props = defineProps({
    close: { type: Function, required: false },
    title: { type: String, required: false},
    subTitle: { type: String, required: false},
    onClick: { type: Function, required: false},
    butText: { type: String, required: false},
    onCancel: { type: Function, required: false},
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

const createNewDirector = async () => {
    const formData = new FormData();
    formData.append('name', directorDataCreate.value.name);
    formData.append('identification', directorDataCreate.value.identification);
    formData.append('phone', directorDataCreate.value.phone);
    formData.append('address', directorDataCreate.value.address);
    formData.append('email', directorDataCreate.value.email);
    formData.append('city', directorDataCreate.value.city);
    formData.append('department', directorDataCreate.value.department);
    if (userPhoto.value) {
        formData.append('photo', userPhoto.value);
    }
    try {
        spinner.value = true;
        const response = await usersApi.post('/manager/director-operations/', 
            formData,
            {
            headers: {
                    Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
                },
        });
        spinner.value = false;
        showToast('Director creado exitosamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        if (props.onClick) {
            props.onClick();
        }
    } catch (error: any) {
        showToast(error, 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[250px] min-h-[370px]" :class="`bg-white`">
            <div class="flex">
                <h1 class="w-full text-start mb-2 mt-2 text-lg font-semibold" :class="`text-green-600`" v-if="props.title">
                    {{ props.title }}
                </h1>
                <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close && props.close()" />
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
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Director" v-model="directorDataCreate.name">
                        </div>
                        <div>
                            <p>Correo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="email" v-model="directorDataCreate.email">
                        </div>
                        <div>
                            <p>Dirección</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Dirección" v-model="directorDataCreate.address">
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
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Identificación" v-model="directorDataCreate.identification">
                        </div>
                        <div>
                            <p>Celular</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Movil" v-model="directorDataCreate.phone">
                        </div>
                        <div>
                            <p>Ciudad</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Ciudad" v-model="directorDataCreate.city">
                        </div>
                        <div>
                            <p>Departamento</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Departamento" v-model="directorDataCreate.department">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="createNewDirector">{{props.butText}}</button>
                <button class="px-4 mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel && props.onCancel()">Cancelar</button>
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
