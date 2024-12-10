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
const paymentUserData = ref<Payment | null>(null);
const spinner = ref<Boolean>(false);

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

interface ClientDetails {
    user_account: number;
    company_name: string;
}

interface Payment {
    id: number;
    payment_date: string;
    registration_date: string;
    amount: string;
    payment_proof: string;
    client_details: ClientDetails;
}

/* methods */

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString();
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}

const getUserPagos = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get(`/paidpurchase/paymentclient/?client=${props.clientId}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
        spinner.value = false;
        paymentUserData.value = response.data;
    } catch (error) {
        spinner.value = false;
    }
}

onMounted( async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getUserPagos()
    }
    
});

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[900px]" :class="`bg-white`">
            <div class="p-2 flex justify-end cursor-pointer" v-if="props.close">
                <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
            </div>
            <div>
                <div>
                    <div class="flex mx-2 mb-4">
                        <p class="text-green-700 font-semibold w-1/4">Empresa</p>
                        <p class="text-green-700 font-semibold w-1/4">Fecha de pago</p>
                        <p class="text-green-700 font-semibold w-1/4">Valor pagado</p>
                        <p class="text-green-700 font-semibold w-1/4">Comprobante de pago</p>
                    </div>
                    <div class="flex mx-2 mb-4" v-for="(pago, index) in paymentUserData" :class="{ 'bg-green-100 rounded-3xl px-2 py-2': index % 2 === 0 }">
                        <div class="w-1/4">{{ pago.client_details.company_name }} </div>
                        <div class="w-1/4">{{ formatDate(pago?.payment_date) }} </div>
                        <div class="w-1/4">{{ pago?.amount }} </div>
                        <div class="w-1/4">
                            <a :href="pago?.payment_proof" target="_blank" class="outline-none border rounded-[35px] px-4 py-1 cursor-pointer">
                                {{ 'Ver Comprobante' }}
                            </a>
                        </div>
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
