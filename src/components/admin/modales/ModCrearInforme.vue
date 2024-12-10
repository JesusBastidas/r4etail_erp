<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const allClients = ref<Clients[]>([]);
const clientProperty = ref<clientProperty[]>([]);
const distribution_planting = ref<File[] | null>(null);
const land_preparation = ref<File[] | null>(null);
const load_transport = ref<File | null>(null);
const property = ref<File | null>(null);
const others = ref<File[] | null>(null);
const currentDate = ref(new Date().toISOString().slice(0, 10));
const spinner = ref<boolean>(false);
/* const clientLocation = ref<number>(0); */

const reportDataCreate = ref<report>({
    location: 0,
    client: 0,
    planting_date: '', 
    planting_distance: 0,
    reforested_area: 0,
    url: '',
});

const props = defineProps({
    close: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    });

/* interfaces */

interface report {
    location: number;
    client: number;
    planting_date: string;
    planting_distance: number;
    reforested_area: number;
    url: string;
}

interface TreeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

interface Client {
    user_account_id: number;
    client_type: string;
    company_name: string;
    RUT: string;
    chamber_of_commerce: string;
    contact_name: string;
    phone: string;
    email: string;
    address: string;
    industry: string;
    logo: string;
    tree_types: TreeType[];
    tree_quantity: number;
    payment_proof: string;
    months_paid: number;
    start_date: string;
    end_date: string;
    predios: any[];
}

type Clients = Client[];

interface User {
    id: number;
    email: string;
    name: string | null;
    user_type: string;
    is_active: boolean;
}

interface Property {
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

type clientProperty = Property[];

/* methods */

const createNewDirector = async () => {
    const formData = new FormData();
    formData.append('location', reportDataCreate.value.location.toString());
    formData.append('client', reportDataCreate.value.client.toString());
    formData.append('planting_date', reportDataCreate.value.planting_date);
    formData.append('planting_distance', reportDataCreate.value.planting_distance.toString());
    formData.append('reforested_area', reportDataCreate.value.reforested_area.toString());
    formData.append('drive_url', reportDataCreate.value.url);
    if (distribution_planting.value) {
        if (Array.isArray(distribution_planting.value)) {
            for (const image of distribution_planting.value) {
            formData.append('distribution_planting', image);
            }
        } else {
            if (distribution_planting.value !== undefined && distribution_planting.value !== null) {
                formData.append('distribution_planting', distribution_planting.value.toString()); 
            }
        }
    }
    if (land_preparation.value) {
        if (Array.isArray(land_preparation.value)) {
            for (const image of land_preparation.value) {
            formData.append('land_preparation', image); 
            }
        } else {
            if (land_preparation.value !== undefined && land_preparation.value !== null) {
                formData.append('land_preparation', land_preparation.value.toString()); 
            }
        }
    }
    if (load_transport.value) {
        formData.append('load_transport', load_transport.value);
    }
    if (property.value) {
        formData.append('maps', property.value);
    }
    if (others.value) {
        if (Array.isArray(others.value)) {
            for (const image of others.value) {
            formData.append('others', image); 
            }
        } else {
            if (others.value !== undefined && others.value !== null) {
                formData.append('others', others.value.toString()); 
            }
        }
    }
    try {
        spinner.value = true;
        const response = await usersApi.post('/operations/reports/', 
            formData,
            {
            headers: {
                    Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
                },
        });
        spinner.value = false;
        showToast('Informe creado exitosamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onClick();
    } catch (error) {
        showToast('Algo salio mal', 'error', 3000, POSITION.BOTTOM_RIGHT);
        spinner.value = false;
    }
};

const getClients = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get('/manager/clients/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        spinner.value = false;
        allClients.value = response.data;
    } catch (error: any) {
        showToast(error.message, 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
};

const getSingleClient = async (id: number) => {
    try {
        spinner.value = true;
        const response = await usersApi.get(`/manager/clients/${id}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        spinner.value = false;
        clientProperty.value = response.data;
    } catch (error: any) {
        showToast(error.message, 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
}

/* onMounted */

onMounted ( async () => {
    await getClients();
    currentDate.value = new Date().toISOString().slice(0, 10);
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
                    <div class="ml-2 mr-6">
                        <div class="mb-2">
                            <p class="mb-2">Cliente</p>
                            <select class="outline-none border rounded-[35px] px-2 py-1 w-full" v-model="reportDataCreate.client" @change="getSingleClient(reportDataCreate.client)">
                                <option value="">Seleccionar</option>
                                <option v-for="client in allClients" :key="client.user_account_id" :value="client.user_account_id">{{ client.company_name }}</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Ubicación</p>
                            <select class="outline-none border rounded-[35px] px-2 py-1 w-full" v-model="reportDataCreate.location">
                                <option value="" selected>Seleccionar</option>
                                <option v-for="location in clientProperty.predios" :key="location.id" :value="location.id">{{ location.location }}</option>
                            </select>
                            <p v-if="reportDataCreate.location === null" class="text-red-600 text-sm">El cliente no tiene predios asociados</p>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Fecha de plantación</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="date" placeholder="Dirección" v-model="reportDataCreate.planting_date" :max="currentDate">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Distancia de siembra (metros cuadrados)</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" placeholder="Dirección" v-model="reportDataCreate.planting_distance">
                        </div>
                        <div>
                            <p class="mb-2">Área reforestada (en metros cuadrados)</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" placeholder="Dirección" v-model="reportDataCreate.reforested_area">
                        </div>
                    </div>
                    <div class="mx-4">
                        <div class="ml-4 mb-2">
                            <p class="mb-2">Distribución y siembra (6 archivos Max)</p>
                            <div>
                                <standar-add-documents multiple @file-list="(files: File[])=> distribution_planting=files" />
                            </div>
                        </div>
                        <div class="ml-4 mb-2">
                            <p class="mb-2">Preparación del terreno (2 archivos Max)</p>
                            <div>
                                <standar-add-documents multiple @file-list="(files: File[])=> land_preparation=files" />
                            </div>
                        </div>
                        <div class="ml-4 mb-2">
                            <p class="mb-2">Cargue y transporte</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> load_transport=files[0]" />
                            </div>
                        </div>
                        <div class="ml-4 mb-2">
                            <p class="mb-2">Predio</p>
                            <div>
                                <standar-add-documents multiple @file-list="(files: File[])=> property=files[0]" />
                            </div>
                        </div>
                        <div class="ml-4 mb-2">
                            <p class="mb-2">Otros (6 archivos Max)</p>
                            <div>
                                <standar-add-documents multiple @file-list="(files: File[])=> others=files" />
                            </div>
                        </div>
                        <div>
                            <p class="mb-2">URL Drive de fotos </p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="string" placeholder="Dirección" v-model="reportDataCreate.url">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="createNewDirector">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
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
