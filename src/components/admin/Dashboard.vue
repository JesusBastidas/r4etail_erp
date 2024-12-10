<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import NavBarVertical from '@/components/admin/modales/NavBarVertical.vue';
import StandarEncabezado from '@/components/shared/StandarEncabezado.vue';
import { useAuthStore } from '@/stores/logVerify'
import { useRouter } from 'vue-router';
import usersApi from '@/stores/userApi';
import { decryptDatos } from '@/stores/hub';
import { POSITION, showToast } from '@/stores/toast';
import StandarCalendario from '@/components/shared/StandarCalendario.vue';
import ModCrearEvento from '@/components/admin/modales/ModCrearEvento.vue';

/* data */
const authStore = useAuthStore();
const router = useRouter();
const allProperties = ref<properties[]>([]);
const allEvents = ref<any[]>([]);
const totales = ref<Summary | null>(null);
const currentYear = computed(() => {
const currentDate = new Date();
    return currentDate.getFullYear();
});
/* interface */

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

interface Summary {
    total_arboles: number;
    total_clientes_activos: number;
    total_eventos: number;
    total_mantenimientos: number;
    total_arboles_mantenimiento: number,
    total_arboles_siembra: number
}

/* methods */

const getProperties = async () => {
    try {
        const response = await usersApi.get('/manager/predios/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        allProperties.value = response.data;
    } catch (error) {
        showToast('Algo salio mal', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}


const getEvents = async() => {
    try {
        const response = await usersApi.get('/operations/event/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        allEvents.value = response.data;
    } catch (error) {
        showToast('No se pudo recuperar información de los eventos', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const recargarAgenda = async () => {
    await getEvents();
}

const getTotales = async () => {
    
    try {
        const response = await usersApi.get('/operations/totales/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        totales.value = response.data;
    } catch (error) {
        showToast('No se pudo recuperar información de estadisticas generales', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}


onMounted( async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getProperties();
        await getEvents();
        await getTotales();
    }
})
</script>

<template>
    <div class="flex" style="height: calc(100vh-96px);">
        <div class="ml-10 mr-20">
            <nav-bar-vertical />
        </div>
        <div class="flex w-full justify-around">

            <div>
                <div>
                    <div>
                        <standar-encabezado :tittle="'PREDIOS'" :otherText="'Ver todos los predios'" :image="true" @click="router.push('/admin/predios')"/>
                    </div>
                    <div>
                        <div class="p-[15px] bg-white rounded-3xl justify-start items-start inline-flex mt-5 mr-5" v-for="predio in allProperties.slice(0, 2)">
                            <div class="flex-col justify-start items-start inline-flex">
                                <div class="mb-5">
                                    <img class="w-[221.99px] h-[147.88px] rounded-lg" src="@/assets/Image/Nature.png" />
                                </div>
                                <div class="self-stretch h-[75.79px] flex-col justify-center items-start flex" >
                                    <div class="self-stretch h-[37.79px] flex-col justify-start items-start flex mt-3">
                                        <div class="text-emerald-900 text-xs font-semibold">{{ predio.predio_name }}</div>
                                        <div class="text-emerald-900 text-[11.19px]">{{ predio.location }}</div>
                                        <div><span class="text-emerald-900 text-[11.19px] font-semibold">Disponible: </span><span class="text-emerald-900 text-[11.19px]">{{ predio.available_area }} mts cuadrados</span></div>
                                    </div>
                                    <div class="self-stretch p-2.5 rounded-[50px] border border-emerald-600 justify-center items-center gap-2.5 inline-flex my-5">
                                        <div class="text-emerald-600 text-[11.19px] cursor-pointer" @click="router.push('/admin/predios')">Ver detalles del predio</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5">
                    <div class="mb-5">
                        <standar-encabezado :tittle="'ESTADISTICAS GENERALES DEL AÑO ' + currentYear" />
                    </div>
                    <div class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        <div class="w-[244px] h-[91px] p-[30px] bg-white rounded-[20px] justify-start items-center inline-flex mx-1">
                            <div class="mr-2">
                                <img src="@/assets/IconsSvg/IconCrearPredio.svg" alt="">
                            </div>
                            <div class="w-[152px] text-stone-900 text-xl font-normal font-['General Sans Variable']">{{ totales?.total_arboles }} árboles vendidos</div>
                        </div>
                        <div class="w-[244px] h-[91px] p-[30px] bg-white rounded-[20px] justify-start items-center inline-flex mx-1">
                            <div class="mr-2">
                                <img src="@/assets/IconsSvg/IconCrearPredio.svg" alt="">
                            </div>
                            <div class="w-[152px] text-stone-900 text-xl font-normal font-['General Sans Variable']">{{ totales?.total_arboles_mantenimiento }} árboles en mantenimiento</div>
                        </div>
                        <div class="w-[244px] h-[91px] p-[30px] bg-white rounded-[20px] justify-start items-center inline-flex mx-1">
                            <div class="mr-2">
                                <img src="@/assets/IconsSvg/IconCrearCliente.svg" alt="">
                            </div>
                            <div class="w-[152px] text-stone-900 text-xl font-normal font-['General Sans Variable']">{{ totales?.total_arboles_siembra }} arboles sembrados</div>
                        </div>
                        <div class="w-[244px] h-[91px] p-[30px] bg-white rounded-[20px] justify-start items-center inline-flex mx-1">
                            <div class="mr-2">
                                <img src="@/assets/IconsSvg/IconEventos.svg" alt="">
                            </div>
                            <div class="w-[152px] text-stone-900 text-xl font-normal font-['General Sans Variable']">{{ totales?.total_eventos }} eventos</div>
                        </div>
                        <div class="w-[244px] h-[91px] p-[30px] bg-white rounded-[20px] justify-start items-center inline-flex mx-1">
                            <div class="mr-2">
                                <img src="@/assets/IconsSvg/IconCrearCliente.svg" alt="">
                            </div>
                            <div class="w-[152px] text-stone-900 text-xl font-normal font-['General Sans Variable']">{{ totales?.total_clientes_activos }} clientes activos</div>
                        </div>
                        <div class="w-[244px] h-[91px] p-[30px] bg-white rounded-[20px] justify-start items-center inline-flex mx-1">
                            <div class="mr-2">
                                <img src="@/assets/IconsSvg/IconMantenimientos.svg" alt="">
                            </div>
                            <div class="w-[152px] text-stone-900 text-xl font-normal font-['General Sans Variable']">{{ totales?.total_mantenimientos }} mantenimientos</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="mb-5">
                    <mod-crear-evento :recargarAgenda="recargarAgenda" tittle="AGENDA" />
                </div>
                <div class="w-full">
                    <standar-calendario :events="allEvents"/>
                </div>
            </div>
        </div>
    </div>
</template>