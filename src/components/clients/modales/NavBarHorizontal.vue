<script setup lang="ts">
import { ref, onMounted } from "vue";
import { showToast, POSITION } from '@/stores/toast';
import { decryptDatos } from '@/stores/hub';
import usersApi from "@/stores/userApi";
import Spinner from "@/components/shared/Spinner.vue";


/* data */

const storedUserId = ref<Number>();
const userReportData = ref<UserReport[]>([]);
const userData = ref<UserAccount>();
const certificado = ref<String>();
const idReportes = ref<Number>(0);
const spinner = ref<boolean>(false);

/* interfaces */

interface TreeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

interface UserAccount {
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

interface Location {
    id: number;
    predio_name: string;
    location: string;
    predio_type: string;
}

interface Client {
    user_account_id: number;
    company_name: string;
    tree_types: TreeType[];
    logo: string;
}

interface UserReport {
    id: number;
    client: Client;
    number_of_trees: number;
    report_date: string;
    planting_date: string;
    planting_distance: string;
    location: Location;
    reforested_area: string;
    carbon_footprint: number;
    multimedia: any[];
}


/* methods */

const recoverUserId = () => {
    storedUserId.value = Number(localStorage.getItem("user_id"));
    if (storedUserId.value !== null && storedUserId.value !== 0) {
        return storedUserId;
    }
    return 0;
};

const getUserReportData = async () => {
    try {
        const response = await usersApi.get(`/operations/reports/?client=${storedUserId.value}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        userReportData.value = response.data[0];
        idReportes.value = userReportData.value.id;
    } catch (error) {  
        if (userReportData.value && userReportData.value.length === 0) {
            showToast('No se pudo recuperar los datos del informe del usuario', 'error', 3000, POSITION.BOTTOM_RIGHT)
        }
    }
}

const getUserData = async () => {
    try {
        const response = await usersApi.get(`/manager/clients/${storedUserId.value}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        userData.value = response.data;
    } catch (error) {
        if (userData.value && userData.value === null || userData.value === undefined ) {
            showToast('No se pudo recuperar los datos del usuario', 'error', 3000, POSITION.BOTTOM_RIGHT)
        }
    }
}

const  getCertificado = async() => {
    try {
        const res = await usersApi.get(`/operations/generar-certificado/${idReportes.value}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        certificado.value = res.data.url;
    } catch (error) {
        if (certificado.value && certificado.value == '') // 'error
        showToast('No se pudo obtener el certificado', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
}
/* onMounted */

onMounted( async () => {
    recoverUserId();
    await getUserReportData();
    await getUserData();
    await getCertificado();
});


</script>

<template>
    <div class="left-[215px] h-[160px]  bg-white rounded-b-2xl">
        <div class="mb-[15px] mx-[40px] flex justify-between">
            <div class="py-4 flex mt-3" >
                <div class="w-[79px] h-[79px] pt-4 pl-1 bg-white rounded-full shadow border-2 border-emerald-600">
                    <img class="rounded-full " :src="userData?.logo" >
                </div>
                <div class="ml-4">
                    <p class="font-semibold text-xl  text-green-700">{{ userData?.company_name }}</p>
                    <p class="font-semibold  text-green-700">{{ userReportData?.reforested_area }} <span class="font-normal">m² reforestados</span></p>
                    <p class="font-semibold text-green-700">CO₂ <span class="font-normal">{{ userReportData?.carbon_footprint ? userReportData?.carbon_footprint : 'No se encontró información asociada' }} Kg</span></p>
                </div>
            </div>
            <div class="py-2 px-4 rounded-[35px] mt-2 bg-green-700">
                <div class="mb-2 pr-3">
                    <p class="text-white text-right text-base font-normal tracking-[2.88px]">CERTIFICADO DE REFORESTACIÓN</p>
                </div>
                <div class="flex">
                    <div class="mr-3 bg-white h-[45px] rounded-[20px] px-2 max-w-[85px] max-h-[45px]">
                        <img class="rounded-xl" :src="userData?.logo" >
                    </div>
                    <div>
                        <p class="text-white">Por su contribución en la recuperación de los bosques<br> nativos como herramienta para mitigar la crisis climática</p>
                        <div class="flex justify-end my-2 ">
                            <div class="w-[140.06px] h-[32.06px] p-[12.53px] bg-white rounded-[21.93px] justify-center items-center gap-[6.27px] inline-flex shadow-md cursor-pointer" >
                                <a :href="certificado" target="_blank" class="text-emerald-900 text-[10.03px] tracking-widest font-medium cursor-pointer">
                                    VER CERTIFICADO
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <spinner v-if="spinner" />
            </div>
        </div>
    </div>
</template>