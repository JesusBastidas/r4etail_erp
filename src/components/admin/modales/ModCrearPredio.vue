<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */
const acuerdoOwner = ref<Boolean> (false) || undefined;
const roceria = ref<Boolean> (false) || undefined;
const acceso = ref<Boolean> (false) || undefined;
const allClients = ref<clients[]>([]);
const createPredioData = ref<predioData>({
    client: 0,
    predio_name: "",
    location: "",
    available_area: 0,
    use_agreement_signed: false,
    difficult_clearing: false,
    difficult_access: false,
    height_predio_mts: 0,
    predio_type: "public",
    contact_name: "",
    contact_phone: "",
    available_trees: 0,
    latitude: 0,
    longitude: 0,
});
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
    });

/* interfaces */

interface predioData {
    client: number;
    predio_name: string;
    location: string;
    available_area: number;
    use_agreement_signed: boolean;
    difficult_clearing: boolean;
    difficult_access: boolean;
    height_predio_mts: number;
    predio_type: "public" | "private";
    contact_name: string;
    contact_phone: string;
    available_trees: number;
    latitude: 0,
    longitude: 0,
}

interface clients {
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
    tree_types: treeType[];
    tree_quantity: number;
    payment_proof: string;
    months_paid: number;
    start_date: string;
    end_date: string;
}

interface treeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

/* methods */

const createPredio = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.post('/manager/predios/', createPredioData.value, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        showToast('Predio creado correctamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.close();
    } catch (error: any) {
        spinner.value = false;
        showToast(error, 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const getClients = async () => {
    try {
        const response = await usersApi.get('/manager/clients/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        allClients.value = response.data;
    } catch (error: any) {
        showToast(error, 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

/* onMounted */

onMounted( async () => {
    await getClients();
})


</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[600px]" :class="`bg-white`">
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
                <div class="flex text-green-700 justify-between mx-4">
                    <div class="mx-2">
                        <!-- <div class="mb-4">
                            <p>Cliente</p>
                            <select class="outline-none border rounded-[35px] px-2 py-1 w-full" name="" id="" v-model="createPredioData.client">
                                <option value="0">Seleccionar cliente</option>
                                <option v-for="client in allClients" :value="client.user_account_id">{{ client.company_name }}</option>
                            </select>
                        </div> -->
                        <div class="mb-4">
                            <p>Nombre del predio</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Nombre del predio" v-model="createPredioData.predio_name">
                        </div>
                        <div class="mb-4">
                            <p>Nombre del contacto</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Nombre del contacto" v-model="createPredioData.contact_name">
                        </div>
                        <div class="mb-4">
                            <p>Ubicación</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Ubicación" v-model="createPredioData.location">
                        </div>
                        <div class="mb-4">
                            <p>Arboles disponibles para siembra</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" v-model="createPredioData.available_trees">
                        </div>
                        <div>
                            <p>Latitud</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Latitud" v-model="createPredioData.latitude">
                        </div>
                    </div>
                    <div>
                        <div class="mb-4">
                            <p>Área disponible</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" v-model="createPredioData.available_area">
                        </div>
                        <div class="mb-4">
                            <p>Numero del contacto</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Telefono del contacto" v-model="createPredioData.contact_phone">
                        </div>
                        <div class="mb-4">
                            <p>Altura del predio <br> (Mts sobre el nivel del mar)</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" v-model="createPredioData.height_predio_mts">
                        </div>
                        <div class="mb-4">
                            <p>Tipo de predio</p>
                            <select class="outline-none border rounded-[35px] px-2 py-1 w-full" v-model="createPredioData.predio_type">
                                <option value="public">Público</option>
                                <option value="private">Privado</option>
                            </select>
                        </div>
                        <div>
                            <p>Longitud</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Longitud" v-model="createPredioData.longitude">
                        </div>
                    </div>
                </div>
            </div>
            <div class="mx-4">
                <div class="flex justify-between">
                    <p class="mr-6 text-green-800">Acuerdo con el dueño</p>
                    <div class="flex">
                        <div class="flex">
                            <input type="radio" v-model="createPredioData.use_agreement_signed" value="true" @change="createPredioData.use_agreement_signed = true">
                            <p class="ml-2 text-green-800">Si</p>
                        </div>
                        <div class="flex ml-4">
                            <input type="radio" v-model="createPredioData.use_agreement_signed" value="false" @change="createPredioData.use_agreement_signed = false">
                            <p class="ml-2 text-green-800">No</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between">
                    <p class="mr-6 text-green-800">Difícil rocería</p>
                    <div class="flex">
                        <div class="flex">
                            <input type="radio" v-model="createPredioData.difficult_clearing" value="true" @change="createPredioData.difficult_clearing = true">
                            <p class="ml-2 text-green-800">Si</p>
                        </div>
                        <div class="flex ml-4">
                            <input type="radio" v-model="createPredioData.difficult_clearing" value="false" @change="createPredioData.difficult_clearing = false">
                            <p class="ml-2 text-green-800">No</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between">
                    <p class="mr-6 text-green-800">Difícil acceso</p>
                    <div class="flex">
                        <div class="flex">
                            <input type="radio" v-model="createPredioData.difficult_access" value="true" @change="createPredioData.difficult_access = true">
                            <p class="ml-2 text-green-800">Si</p>
                        </div>
                        <div class="flex ml-4">
                            <input type="radio" v-model="createPredioData.difficult_access" value="false" @change="createPredioData.difficult_access = false">
                            <p class="ml-2 text-green-800">No</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-around">
                <button class="px-7 py-1 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="createPredio">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="props.onCancel">Desactivar cliente</button>
            </div>
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

