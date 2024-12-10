<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/logVerify';
import { showToast, POSITION } from '@/stores/toast';
import { decryptDatos } from '@/stores/hub';
import ModCrearPredio from '@/components/admin/modales/ModCrearPredio.vue';
import ModDetallesPredio from '@/components/admin/modales/ModDetallesPredio.vue';
import ModEditarPredio from '@/components/admin/modales/ModEditarPredio.vue'
import ModAgendarMantenimiento from '@/components/admin/modales/ModAgendarMantenimiento.vue'
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */
const authStore = useAuthStore();

const modCreate = ref<Boolean> (false) || undefined;
const modDetailsProperty = ref<Boolean> (false) || undefined;
const modalEditProperty = ref<Boolean> (false) || undefined;
const modSetMaintenance = ref<Boolean> (false) || undefined;
const allProperties = ref<properties[]>([]);
const propertyId = ref<number>(0);
const spinner = ref<Boolean> (false);

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
}

type properties = Property[];

/* methods */

const closeModals = () => {
    modCreate.value = false;
    modDetailsProperty.value = false;
    modalEditProperty.value = false;
    modSetMaintenance.value = false;
}

const createProperty = async () => {
    setTimeout(closeModals, 1000)
    await getProperties();
}

const openDetailsProperty = (id: number) => {
    propertyId.value = id
    modDetailsProperty.value = true;
}

const deleteClient = async () => {
    await getProperties();
    setTimeout(closeModals, 1000)
}

const initEditProperty = () => {
    modDetailsProperty.value = false;
    modalEditProperty.value = true;
}

const closeCreateProperty = async () => {
    modCreate.value = false;
    await getProperties();
}

const editProperty = async () => {
    await getProperties();
    setTimeout(closeModals, 1000)
}

const getProperties = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get('/manager/predios/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        allProperties.value = response.data;
    } catch (error: any) {
        spinner.value = false;
        showToast('No se ha podido recuperar información de los predios', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}


onMounted(async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getProperties();
    }
})

</script>

<template>
    <div class="bg-white my-5 mx-3 rounded-[30px]">
        <div class="flex justify-end py-3 px-5 border-b-2">
            <button class="bg-emerald-900 px-5 py-2 rounded-[35px] text-white cursor-pointer hover:scale-105 ml-4" @click="modCreate=true">Crear Predio +</button>
        </div>
        <div class="pb-5">
            <div class="mb-5">
                <div class="flex justify-between mx-9 text-neutral-500">
                    <p class="w-1/5">Ubicación</p>
                    <p class="w-1/5 mx-2">Área disponible (en metros cuadrados)</p>
                    <p class="w-1/5">Altura del predio en metros</p>
                    <p class="w-1/5">Arboles disponibles para siembra</p>
                    <div class="w-1/5"></div>
                </div>
            </div>
            <div class="cursor-pointer justify-center items-center" v-for="(predio, index) in allProperties">
                <div class="flex justify-between justify-items-center items-center content-center mx-10 px-5 py-5 text-emerald-900" :class="{ 'bg-green-100 rounded-3xl': index % 2 === 0 }">
                    <div class="flex flex-col w-1/5">
                        <p>{{ predio.predio_name }}</p>
                        <div class="flex">
                            <img src="@/assets/IconsSvg/IconUbicacion.svg">
                            <p class="font-semibold">{{ predio.location }}</p>
                        </div>
                    </div>
                    <div class="w-1/5">{{ predio.available_area }}</div>
                    <div class="w-1/5">{{ predio.height_predio_mts }}</div>
                    <div class="w-1/5">{{ predio.available_trees }}</div>
                    <button class="border border-green-900 rounded-[35px] text-emerald-900 px-3 cursor-pointer hover:scale-105 font-semibold w-1/5" @click="openDetailsProperty(predio.id)">Ver detalles</button>
                </div>
            </div>
            <div>
                <mod-crear-predio v-if="modCreate" :close="closeCreateProperty"  title="CREAR PREDIO" :butText="'Crear Predio'" :onClick="createProperty" />
            </div>
            <div>
                <mod-detalles-predio v-if="modDetailsProperty" :close="()=>modDetailsProperty=false" title="Nombre empresa" forestType="200 hectareas disponibles" subTitle="Bosquecito" butText="Eliminar predio" :onCancel="initEditProperty" :onClick="deleteClient" :predioId="propertyId"/>
            </div>
            <div>
                <mod-editar-predio v-if="modalEditProperty" :close="()=>modalEditProperty=false" title="Nombre empresa" forestType="200 hectareas disponibles" subTitle="Bosquecito" butText="Guardar cambios" :onClick="editProperty" :onCancel="()=>modalEditProperty=false" :predioId="propertyId"/>
            </div>
            <div>
                <mod-agendar-mantenimiento v-if="modSetMaintenance" :close="closeModals" title="AGENDAR MANTENIMIENTO" butText="Guardar cambios" :onClick="agendarMantenimiento" :predioId="propertyId"/>
            </div>
        </div>
        <div>
            <spinner v-if="spinner" />
        </div>
    </div>
</template>