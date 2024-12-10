<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import { useAuthStore } from '@/stores/logVerify'
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const authStore = useAuthStore();
const spinner = ref<Boolean>(false);
const clientProperty = ref<userData>()

const props = defineProps({
    close: { type: Function },
    forestType: { type: String },
    cambioBosque: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    clientId: { type: Number },
});

/* interfaces */

interface TreeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

interface Predio {
    id: number;
    predio_name: string;
    location: string;
    latitude: string;
    longitude: string;
}

interface userData {
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
    predios: Predio[];
}

/* methods */

const userData = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get(`/manager/clients/${props.clientId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
    });
    clientProperty.value = response.data;
    spinner.value = false;
    } catch (error) {
        showToast('No se pudo recuperar la información de los clientes', 'error', 3000, POSITION.BOTTOM_RIGHT);
        console.log(error);
        spinner.value = false;
    }
    
};



onMounted( async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await userData();
    }
    
});

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[700px]" :class="`bg-white`">
            <div class="p-2 flex justify-end cursor-pointer" v-if="props.close">
                <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
            </div>
            <div>
                <div>
                    <div class="flex mx-2 mb-4">
                        <p class="text-green-700 font-semibold w-1/2">Nombre del predio</p>
                        <p class="text-green-700 font-semibold w-1/2">Ubicación</p>
                    </div>
                    <div class="flex mx-2 mb-4 px-2" v-for="(predio, index) in (clientProperty?.predios ?? [])" :class="{ 'bg-green-100 rounded-3xl px-2 py-2': index % 2 === 0 }">
                        <p class="w-1/2">{{ predio.predio_name }}</p>
                        <p class="w-1/2">{{ predio.location}}</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-around">
                <button class="px-7 py-1 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="props.onClick">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
            </div>
        </div>
        <div>
            <spinner v-if="spinner" />
        </div>
    </div>
</template>
