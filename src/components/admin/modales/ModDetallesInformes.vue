<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/logVerify'
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const authStore = useAuthStore();
const reportData = ref<ReportDetail>();
const reportId = ref<Number>(0);
const reportUrl = ref<String>('');
const spinner = ref<Boolean>(false);

const props = defineProps({
    close: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    reportId: { type: Number },
    });

/* interfaces */

/* interface TreeType {
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
 */

    interface ReportDetail {
    data: Array<{
        id: number;
        client: {
        user_account_id: number;
        company_name: string;
        tree_types: Array<{
            tree_type: { name: string };
            quantity: number;
        }>;
        logo: string;
        };
        number_of_trees: number;
        report_date: string;
        planting_date: string;
        planting_distance: string;
        location: {
        id: number;
        predio_name: string;
        location: string;
        predio_type: string;
        };
        reforested_area: string;
        carbon_footprint: number;
        multimedia: Array<any>; 
    }>;
    }


/* methods */

const getReportDetail = async () => {
    try {
        const res = await usersApi.get(`/operations/reports/?client=${props.reportId}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        reportData.value = res.data[0];
        reportId.value = reportData.value?.id;
    } catch (error) {
        showToast('Ups algo salio mal', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
};

const getReportPdf = async () => {
    try {
        spinner.value = true;
        const res = await usersApi.get(`/operations/generar-pdf/${reportId.value}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        spinner.value = false;
        reportUrl.value = res.data;
    } catch (error) {
        showToast('Algo salio mal', 'error', 3000, POSITION.BOTTOM_RIGHT);
        spinner.value = false;
    }
};

const deactivateReport = async (id: number) => {
    try {
        spinner.value = true;
        const res = await usersApi.delete (`/operations/reports/${id}/`,
        {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        showToast('Informe eliminado', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onClick();
    } catch (error) {
        showToast('No se pudo eliminar el informe', 'error', 3000, POSITION.BOTTOM_RIGHT);
        spinner.value = false;
    }
}


/* onMounted */

onMounted( async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getReportDetail();
        await getReportPdf();
    }
})

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[300px] min-h-[370px]" :class="`bg-white`">
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
            <div v-if="reportData">
                <div class="flex">
                    <div class="ml-2 mr-6">
                        <div class="mb-2">
                            <p class="mb-2">Cliente</p>
                            <p class="outline-none border rounded-[35px] px-2 py-1 w-full" disabled>{{ reportData.client.company_name }}</p>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Ubicación</p>
                            <p class="outline-none border rounded-[35px] px-2 py-1 w-full" disabled>{{ reportData.location.location }}</p>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Fecha de plantación</p>
                            <p class="outline-none border rounded-[35px] px-2 py-1 w-full" type="date" disabled>{{ reportData.planting_date }}</p>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Distancia de siembra (en metros cuadrados)</p>
                            <p class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" disabled>{{ reportData.planting_distance }}</p>
                        </div>
                        <div>
                            <p class="mb-2">Área reforestada (en metros cuadrados)</p>
                            <p class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" disabled>{{ reportData.reforested_area }}</p>
                        </div>
                    </div>
                    
                    <div class="mx-4 min-w-[300px]">
                        <div class="ml-4 mb-2">
                            <p class="mb-2">Multimedia</p>
                            <div v-if="reportData.multimedia.length > 0">
                                <ul class="list-disc list-inside">
                                    <li v-for="(file, index) in reportData.multimedia" :key="index" class="mb-2">
                                        <a :href="file.photo" target="_blank" class="px-2 py-1 text-green-700">
                                            {{ file.photo_type }}
                                        </a>
                                    </li>   
                                </ul>
                            </div>
                            <div v-else>
                            <p class="text-green-700 font-semibold">No hay archivos multimedia disponibles.</p>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p class="mb-2">Informe</p>
                                <a :href="reportUrl.url " target="_blank" class="px-2 py-1 text-green-700 font-semibold cursor-pointer">
                                    Vista previa del informe
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="deactivateReport(Number(reportId))">{{props.butText}}</button>
                <button class="px-4 mt-4 border rounded-[35px] shadow-md" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
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
