<script setup lang="ts">
import { onMounted, ref } from 'vue';
import usersApi from '@/stores/userApi';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import { decryptDatos } from '@/stores/hub';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';


const paymentDate = ref('');
const paymentValue = ref(0);
const paymentProof = ref<File|null>(null);
const storedUserId = ref<Number>(0);


const props = defineProps({
    close: { type: Function },
    icoType: { type: String },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    onCancel: { type: Function },
    clientId: { type: Number }
});

/* data */

const recoverUserId = () => {
    storedUserId.value = Number(localStorage.getItem("user_id"));
    if (storedUserId.value !== null && storedUserId.value !== 0) {
        return storedUserId;
    }
    return 0;
}; 

const postPaymentInfo = async () => {
    
    const formData = new FormData();
    formData.append('client', storedUserId.value.toString());
    formData.append('payment_date', paymentDate.value);
    formData.append('amount', paymentValue.value.toString());
    if (paymentProof.value) {
        formData.append('payment_proof', paymentProof.value);
    }


    try {
        const res = await usersApi.post('/paidpurchase/paymentclient/', formData, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
        props.close?.()
        showToast('Se envio la información', 'success', 3000, POSITION.BOTTOM_RIGHT);
    } catch (error) {
        showToast('No se pudo enviar la información', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

onMounted(() => {
    recoverUserId();
});

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#89858533] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[300px]" :class="`bg-white`">
            <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                <icon-close :width="'20px'" :height="'20px'" @click="props.close?.()" />
            </div>
            <h1 class="w-full text-center my-4 text-2xl" :class="`text-green-900`" v-if="props.title">
                {{ props.title }}
            </h1>
            <p class="w-full text-center my-4 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                {{ props.subTitle }}
            </p>

            <div class="grid grid-cols-2 gap-4 mb-4 w-full text-neutral-500">
                <div>
                    <label for="paymentValue" class="mb-2">Valor del Pago:</label>
                    <input id="paymentValue" type="text" v-model="paymentValue"
                        class="outline-none border rounded-[35px] px-2 py-1 w-full">
                </div>
                <div>
                    <label for="paymentDate" class="mb-2">Fecha de Pago:</label>
                    <input id="paymentDate" type="date" v-model="paymentDate"
                        class="outline-none border rounded-[35px] px-2 py-1 w-full">
                </div>
            </div>
            <div class="w-[200px] mb-4">
                <standar-add-documents  @file-list="(files: File[])=> paymentProof=files[0]"/>
            </div>
            <div class="flex">
                <button class="bg-emerald-900 px-5 py-2 rounded-[35px] text-white cursor-pointer hover:scale-105" :class="`text-green-700`" v-if="props.onCancel" @click="postPaymentInfo">Subir información</button>
            </div>
        </div>
    </div>
</template>
