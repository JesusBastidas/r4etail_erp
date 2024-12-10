<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const trueEdit = ref<Boolean> (false) || undefined;
const spinner = ref<Boolean> (false);
const singleUserData = ref<userDataCreate>({
    client_type: '',
    company_name: '',
    contact_name: '',
    phone: '',
    address: '',
    email: '',
    industry: '',
    tree_quantity: 0,
    months_paid: 0,
    end_date: '',
    tree_types: [],
    RUT: '',
    payment_proof: '',
    chamber_of_commerce: '',
    logo: '',
});

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

interface userDataCreate {
    client_type: string;
    company_name: string;
    contact_name: string;
    phone: string;
    address: string;
    email: string;
    industry: string;
    tree_quantity: number;
    months_paid: number;
    end_date: string;
    tree_types: string[];
    RUT: string;
    payment_proof: string;
    chamber_of_commerce: string;
    logo: string;
}

/* methods */

const getUserDetail = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.get(`/manager/clients/${props.clientId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        spinner.value = false;
        singleUserData.value = {
            client_type: res.data.client_type,
            company_name: res.data.company_name,
            contact_name: res.data.contact_name,
            phone: res.data.phone,
            address: res.data.address,
            email: res.data.email,
            industry: res.data.industry,
            tree_quantity: res.data.tree_quantity,
            months_paid: res.data.months_paid,
            end_date: res.data.end_date,
            tree_types: res.data.tree_types,
            RUT: res.data.RUT,
            payment_proof: res.data.payment_proof,
            chamber_of_commerce: res.data.chamber_of_commerce,
            logo: res.data.logo,
        }
    } catch (error) {
        spinner.value = false;
        showToast('No se ha poopdido recuperar inoformación del cliente', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

onMounted( async () => {
    await getUserDetail();
});

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[250px]" :class="`bg-white`">
            <div class="flex justify-between">
                <div class="flex">
                    <h1 class="text-start mb-2 mt-2 text-sm font-semibold" :class="`text-green-900`" v-if="props.title">
                        {{ singleUserData.company_name }}
                    </h1>
                    <div class="bg-gray-300 ml-2 text-green-800 text-sm rounded-[35px] px-3 content-center">
                        {{ singleUserData.client_type === 'client_bosque_propio' ? 'Cliente bosque propio' : 'Cliente bosque colectivo' }}
                    </div>
                </div>
                <div class="p-2 flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
            </div>
            <!-- <div class="flex">
                <img src="@/assets/IconsSvg/IconUbicacion.svg">
                <p class="text-start my-2 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                    {{ props.subTitle }}
                </p>
            </div> -->
            <div>
                <div class="flex">
                    <div class="mx-2">
                        <div class="my-2">
                            <p class="mb-2">Nombre de la empresa</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="text" placeholder="Usuario" v-model="singleUserData.company_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Correo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="text" placeholder="email" v-model="singleUserData.email">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Industria</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="text" placeholder="Industria" v-model="singleUserData.industry">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Numero de meses contratados</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="number" placeholder="Meses contratados" v-model="singleUserData.months_paid">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Numero de arboles</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="number" placeholder="Meses contratados" v-model="singleUserData.tree_quantity">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Logo de la empresa</p>
                            <a :href="singleUserData.logo" target="_blank" class="outline-none border rounded-[35px] px-2 py-1">
                                {{ 'Logo de la empresa' }}
                            </a>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">RUT</p>
                            <a :href="singleUserData.RUT" target="_blank" class="outline-none border rounded-[35px] px-2 py-1">
                                {{ 'Registro unico tributario' }}
                            </a>
                        </div>
                    </div>
                    <div class="mx-2">
                        <div class="my-2">
                            <p class="mb-2">Nombre del encargado</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="text" placeholder="Usuario" v-model="singleUserData.contact_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Celular</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="text" placeholder="Movil" v-model="singleUserData.phone">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Dirección</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="text" placeholder="Dirección" v-model="singleUserData.address">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Fecha de finalizacion del contrato</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" disabled type="date" placeholder="Dirección" v-model="singleUserData.end_date">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Prueba de pago</p>
                            <a :href="singleUserData.payment_proof" target="_blank" class="outline-none border rounded-[35px] px-2 py-1">
                                {{ 'Prueba de pago' }}
                            </a>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Cámara de comercio</p>
                            <a :href="singleUserData.chamber_of_commerce" target="_blank" class="outline-none border rounded-[35px] px-2 py-1">
                                {{ 'Cámara de comercio' }}
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
