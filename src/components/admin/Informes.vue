<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/logVerify';
import { showToast, POSITION } from '@/stores/toast';
import { decryptDatos } from '@/stores/hub';
import usersApi from '@/stores/userApi';
import ModDetallesInformes from '@/components/admin/modales/ModDetallesInformes.vue';
import ModCrearInforme from '@/components/admin/modales/ModCrearInforme.vue';
import Spinner from '@/components/shared/Spinner.vue';


/* data */
const authStore = useAuthStore();

const createReport = ref<Boolean> (false) || undefined;
const editReport = ref<Boolean> (false) || undefined;
const allReports = ref<ReportData>();
const reportId = ref<number>(0);
const reportDetails = ref<Boolean> (false) || undefined;
const spinner = ref<Boolean> (false);

/* interfaces */

interface TreeType {
    tree_type: {
        name: string;
    };
    quantity: number;
}

interface Client {
    user_account_id: number;
    company_name: string;
    tree_types: TreeType[];
    logo: string;
}

interface Location {
    id: number;
    predio_name: string;
    location: string;
    predio_type: string;
}

interface ReportData {
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

const closeModals = () => {
    createReport.value = false;
    reportDetails.value = false;
    editReport.value = false;
}
const openReportDetails = (id:number) => {
    reportId.value = id;
    reportDetails.value=true
}

const reloadView = () => {
    getReports();
    setTimeout( closeModals, 1000);
}

const closeCreateReport = () => {
    getReports();
    setTimeout( closeModals, 1000);
}

const btnCreateManager = () => {
    createReport.value = true;
    console.log(createReport.value);
}

const getReports = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.get ('/operations/reports/',
        {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        allReports.value = res.data;
    } catch (error) {
        showToast('No se pudo obtener información de los informes', 'error', 3000, POSITION.BOTTOM_RIGHT);
        spinner.value = false;
    }
};


/* onMounted */
onMounted( async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getReports();
    }
})

</script>

<template>
    <div class="bg-white my-5 mx-3 rounded-[30px]">
        <div class="flex justify-end py-3 px-5 border-b-2">
            <button class="bg-emerald-900 px-5 py-2 rounded-[35px] text-white cursor-pointer hover:scale-105" @click="btnCreateManager()">Crear Informe +</button>
        </div>
        <div class="pb-5">
            <div>
                <div class="flex justify-between mx-9 text-neutral-500">
                    <p class="w-1/5">Nombre de la empresa</p>
                    <p class="w-1/5">Ubicación del predio</p>
                    <p class="w-1/5">Fecha de siembra</p>
                    <p class="w-1/5">Área reforestada</p>
                    <div class="w-1/5"></div>
                </div>
            </div>
            <div class="cursor-pointer justify-center items-center mt-5" v-for="(report, index) in allReports">
                <div class="flex justify-between justify-items-center items-center content-center mx-10 py-5 px-5 text-emerald-900" :class="{ 'bg-green-100 rounded-3xl': index % 2 === 0 }">
                    <div class="w-1/5">{{ report.client.company_name }}</div>
                    <div class="w-1/5">{{ report.location.predio_name }}</div>
                    <div class="w-1/5">{{ report.planting_date }}</div>
                    <div class="w-1/5">{{ report.reforested_area }}</div>
                    <button class="border border-green-900 rounded-[35px] text-emerald-900 px-3 cursor-pointer hover:scale-105 font-semibold w-1/5" @click="openReportDetails(report.client.user_account_id)">Ver detalles</button>
                </div>
            </div>
            <div>
                <mod-detalles-informes v-if="reportDetails" :reportId="reportId"  :close="closeModals" :onClick="reloadView" butText="Eliminar informe" title="Detalles del informe" :onCancel="closeModals"/>
            </div>
            <div>
                <mod-crear-informe v-if="createReport" :close="closeModals" title="Crear Informe"  :onClick="closeCreateReport" butText="Crear informe" :onCancel="closeModals"/>
            </div>
            <div>
                <spinner v-if="spinner" />
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