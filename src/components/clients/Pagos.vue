<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/logVerify';
import { showToast, POSITION } from '@/stores/toast';
import usersApi from '@/stores/userApi';
import ModalSubirComprobante from '@/components/shared/modales/ModalSubirComprobante.vue';
import { decryptDatos } from '@/stores/hub';

/* data */
const subirComprobante = ref<Boolean>(false);
const authStore = useAuthStore();
const allTransacciones = ref<any[]>([]);
const storedUserId = ref<Number>(0);

/* methods */

const recoverUserId = () => {
    storedUserId.value = Number(localStorage.getItem("user_id"));
    if (storedUserId.value !== null && storedUserId.value !== 0) {
        return storedUserId;
    }
    return 0;
}; 

const closeModal = async () => {
    subirComprobante.value = false;
    await getTransacciones();
}

const mensaje = () => {
    showToast('El mensaje a mostrar', 'success', 3000, POSITION.BOTTOM_RIGHT)
}

const openPaymentProof = (paymentProof: string) => {
    window.open(paymentProof, '_blank');
}

const getTransacciones = async () => {
    try {
        const res = await usersApi.get(`/paidpurchase/paymentclient/?client=${storedUserId.value}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
        allTransacciones.value = res.data; 
    } catch (error) {
        showToast('No se pudo recuperar la información del endpoint', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
}



/* onMounted */
onMounted(async () => {
    authStore.userVerify()
    if (localStorage.getItem('token')) {
        recoverUserId();
        await getTransacciones();
    }
});

</script>

<template>
    <div class="bg-white my-5 mx-[50px] rounded-[30px]">
        <div class="flex justify-end py-3 px-5 border-b-2">
            <button class="bg-emerald-900 px-5 py-2 rounded-[35px] text-white cursor-pointer hover:scale-105"
                @click="subirComprobante = true">Subir comprobante</button>
        </div>
        <div class="pb-5">
            <div>
                <div class="flex justify-between mx-9 text-neutral-500">
                    <p class="w-1/5">No. Referencia</p>
                    <p class="w-1/5">Cantidad</p>
                    <p class="w-1/5">Fecha de Pago</p>
                    <p class="w-1/5">Nombre de la Compañía</p>
                    <div class="w-1/5"></div>
                </div>
            </div>
            <div class="cursor-pointer justify-center items-center mt-5"
                v-for="(transaccion, index) in allTransacciones">
                <div class="flex justify-between justify-items-center items-center content-center mx-10 py-5 px-5 text-emerald-900"
                    :class="{ 'bg-green-100 rounded-3xl': index % 2 === 0 }">
                    <div class="w-1/5">{{ transaccion.id }}</div>
                    <div class="w-1/5">{{ transaccion.amount }}</div>
                    <div class="w-1/5">{{ new Date(transaccion.payment_date).toISOString().split('T')[0] }}</div>
                    <div class="w-1/5">{{ transaccion.client_details.company_name }}</div>
                    <button
                        class="border border-green-900 rounded-[35px] text-emerald-900 px-3 cursor-pointer hover:scale-105 font-semibold w-1/5"
                        @click="openPaymentProof(transaccion.payment_proof)">Ver Comprobante</button>
                </div>
            </div>
        </div>
        <div>
            <modal-subir-comprobante v-if="subirComprobante" :close="closeModal" title="Subir comprobante" subTitle="Sube el comprobante" :onClick="mensaje" :onCancel="closeModal" :clientId="storedUserId.value" />
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