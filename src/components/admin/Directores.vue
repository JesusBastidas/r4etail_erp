<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/logVerify';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '../../stores/toast';
import usersApi from '@/stores/userApi';
import ModCrearDirector from '@/components/admin/modales/ModCrearDirector.vue'
import ModDetallesDirector from '@/components/admin/modales/ModDetallesDirector.vue'
import ModEditDirector from '@/components/admin/modales/ModEditDirector.vue'
import Spinner from '@/components/shared/Spinner.vue';
import axios from 'axios';

let get = axios.get

/* data */
const authStore = useAuthStore();

const createManager = ref<Boolean> (false) || undefined;
const managerDetails = ref<Boolean> (false) || undefined;
const editManager = ref<Boolean> (false) || undefined;
const allManagers = ref<managers[]>([]);
const managerId = ref<number>(0);
const spinner = ref<Boolean> (false);

/* interfaces */

interface Director {
    id: number;
    photo: string | null;
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

type managers = Director[];

/* methods */
const createManagerModal=() => {
    console.log('createManagerModal');
    createManager.value = true;
}

const closeModals = () => {
    createManager.value = false;
    managerDetails.value = false;
    editManager.value = false;
}

const openManagerDetails = (id:number) => {
    managerId.value = id;
    managerDetails.value=true
}

const createManagerBtn = ()=> {
    setTimeout( closeModals, 1000);
    getDirectores();
}

const openEditManager = ()=> {
    editManager.value = true;
    managerDetails.value = false;
}

const editManagerBtn = ()=> {
    console.log('editManagerBtn');
    setTimeout( closeModals, 1000);
}

const deleteDirector = async () => {
    await getDirectores();
    setTimeout( closeModals, 1000);
}

const getDirectores = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.get ('/manager/director-operations/',
        {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        allManagers.value = res.data;
    } catch (error) {
        spinner.value = false;
        showToast('No se pudo obtener información de los directores de operaciones', 'success', 3000, POSITION.BOTTOM_RIGHT)
    }
}

/* onMounted */
onMounted( async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getDirectores();
    }
})

</script>

<template>
    <div class="bg-white my-5 mx-3 rounded-[30px]">
        <div class="flex justify-end py-3 px-5 border-b-2">
            <button class="bg-emerald-900 px-5 py-2 rounded-[35px] text-white cursor-pointer hover:scale-105" @click="createManagerModal()">Crear Director +</button>
        </div>
        <div class="pb-5">
            <div>
                <div class="flex justify-between mx-9 text-neutral-500">
                    <p class="w-1/5">Nombre del director</p>
                    <p class="w-1/5">Correo</p>
                    <p class="w-1/5">Teléfono Móvil</p>
                    <p class="w-1/5">Ciudad</p>
                    <div class="w-1/5"></div>
                </div>
            </div>
            <div class="cursor-pointer justify-center items-center mt-5" v-for="(director, index) in allManagers" key="director">
                <div class="flex justify-between justify-items-center items-center content-center mx-10 py-5 px-5 text-emerald-900" :class="{ 'bg-green-100 rounded-3xl': index % 2 === 0 }">
                    <div class="w-1/5">{{ director.name }}</div>
                    <div class="w-1/5">{{ director.email }}</div>
                    <div class="w-1/5">{{ director.phone }}</div>
                    <div class="w-1/5">{{ director.city }}</div>
                    <button class="border border-green-900 rounded-[35px] text-emerald-900 px-3 cursor-pointer hover:scale-105 font-semibold w-1/5" @click="openManagerDetails(director.id)">Ver detalles</button>
                </div>
            </div>
        </div>
        <mod-crear-director v-if="createManager" :close="closeModals" title="CREAR DIRECTOR" :on-click="createManagerBtn" but-text="Crear director"/>
        <div>
            <mod-detalles-director v-if="managerDetails" :close="closeModals" title="DETALLES DEL DIRECTOR" :on-click="openEditManager" :onCancel="deleteDirector" but-text="Editar director"  :directorId="managerId"/>
        </div>
        <div>
            <mod-edit-director v-if="editManager" :close="closeModals" title="EDITAR DIRECTOR" :on-click="editManagerBtn" but-text="Guardar cambios"  :directorId="managerId"/>
        </div>
        <div>
            <spinner v-if="spinner"/>
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