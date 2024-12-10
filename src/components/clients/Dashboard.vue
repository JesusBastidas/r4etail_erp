<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/logVerify';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '../../stores/toast';
import { useRouter } from 'vue-router';
import usersApi from '@/stores/userApi';
import StandarCalendario from '@/components/shared/StandarCalendario.vue';
import Spinner from '@/components/shared/Spinner.vue';

/* data */

const auth = useAuthStore();
const router = useRouter();
const storedUserId = ref<Number>(0);
const userReportData = ref<UserReport[]>([]);
const storedUserType = ref<String>("");
const reportUrl = ref<String>("");
const idReportes = ref<Number>(0);
const blogData = ref<Array<any>>();
const spinner = ref<Boolean>(false);
const allEvents = ref<any[]>([]);

const recoverUserId = () => {
    storedUserId.value = Number(localStorage.getItem("user_id"));
    if (storedUserId.value !== null && storedUserId.value !== 0) {
        return storedUserId;
    }
    return 0;
};

const singleUserData = computed(() => {

let mostRecentDate = null;
let singleUserData = null;

for (const userData of userReportData.value) {
    const reportDate = new Date(userData.report_date);
    
    if (mostRecentDate === null || reportDate > mostRecentDate) {
    mostRecentDate = reportDate;
    singleUserData = userData; 
    }
}
return singleUserData;
});

/* interfaces */

interface TreeType {
    tree_type: {
        name: string;
    };
    quantity: number;
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

/* funcion para obtener los informes del usuario para los datos de la siembra actual */
const getAllReports = async () => {
    spinner.value = true;
    try {
        const res = await usersApi.get(`/operations/reports/?client=${storedUserId.value}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        userReportData.value = res.data;
        idReportes.value = userReportData.value[0].id;
        spinner.value = false
        console.log(userReportData.value)
    } catch (error:any) {
        if ( userReportData.value ) {
            /* showToast('No se encontraron informes', 'error', 3000, POSITION.BOTTOM_RIGHT) */
            /* spinner.value = false */
        } else {
            showToast('No se pudo recuperar la información de los informes', 'error', 3000, POSITION.BOTTOM_RIGHT)
            /* spinner.value = false */
        }
    }
    spinner.value = false
}

/* funciones para obtener el nombre del mes y el año de la fecha de siembra */
function getMonthName(dateString: string) {
    const date = new Date(dateString);
    const monthIndex = date.getMonth(); 
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNames[monthIndex]; 
}

function extractYear(dateString: string) {
    return dateString.split('-')[0]; 
}

/* funcion para obtener el tipo de usuario */
const userType = () => {
    storedUserType.value = decryptDatos(localStorage.getItem("userType") || "");
    if (storedUserType.value !== null && storedUserType.value !== "") {
        return storedUserType;
    }
    return "unknown";
};

/* funcion para recuperar el informe */ 

const getReportUrl = async () => {
    try {
        const res = await usersApi.get(`/operations/generar-pdf/${idReportes.value}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        reportUrl.value = res.data.url;
    } catch (error:any) {
        if (reportUrl.value || reportUrl.value == '') {
            showToast('Todavia no hay informes', 'error', 3000, POSITION.BOTTOM_RIGHT)
        } else {
            showToast('No se pudo recuperar el informe', 'error', 3000, POSITION.BOTTOM_RIGHT)
        }
    }
}

const getBlog = async () => {
    
    try {
        const response = await usersApi.get('/manager/blogs/', {
            
        })
        blogData.value = response.data[0]
    } catch (error) {
        showToast('Entrada de blog no encontrada', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
    
}

const getEvents = async() => {
    try {
        const response = await usersApi.get(`/operations/event/?client=${storedUserId.value}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        allEvents.value = response.data;
    } catch (error) {
        showToast('No se pudo recuperar información de los eventos', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}
/* 
const recargarAgenda = async () => {
    await getEvents();
} */


/* lifecycles */

onMounted( async () => {
    spinner.value = true;
    auth.userVerify()
    if (localStorage.getItem('token')) {
        recoverUserId();
        userType();
        await getBlog();
        await getEvents();
        await getAllReports();
        await getReportUrl();
    }
    spinner.value = false;
});
</script>
<template>
    <div class="mx-[50px] mt-[50px]">
        <div class="w-full flex-col justify-between items-start gap-[30px] inline-flex">
            <div class="flex-col justify-start items-start gap-[27px] flex">
                <div class="text-emerald-900 text-2xl font-semibold tracking-[4.32px]">SIEMBRA ACTUAL</div>
            </div>
            <div class="flex justify-between w-full">
                <div class="mr-4 w-2/3">
                    <div class="flex justify-between mb-4">
                        <div class="p-[30px] mr-4 bg-white rounded-[20px] justify-start items-center gap-2.5 flex w-1/3">
                            <div>
                                <img src="@/assets/IconsSvg/IconCalendar.svg" alt="">
                            </div>
                            <div class="text-black text-xl font-normal">{{ getMonthName(singleUserData?.planting_date ?? '') }} {{ extractYear(singleUserData?.planting_date ?? '') }}</div>
                        </div>
                        <div class="p-[30px] mr-4 bg-white rounded-[20px] justify-start items-center gap-2.5 flex w-1/3">
                            <div>
                                <img src="@/assets/IconsSvg/IconArbolito.svg" alt="">
                            </div>
                            <div class="text-black text-xl font-normal">{{ singleUserData?.number_of_trees }} árboles</div>
                        </div>
                        <div class="p-[30px] bg-white rounded-[20px] justify-start items-center gap-2.5 flex w-1/3">
                            <div class="w-[15px] h-[15px]">
                                <img src="@/assets/IconsSvg/IconUbicacionGrande.svg" alt="">
                            </div>
                            <div class="text-black text-xl font-normal">{{ singleUserData?.location.predio_name }}</div>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="bg-white px-2 pt-2 pb-4 rounded-[20px] mr-2" :class="{ 'w-1/2': storedUserType === 'client_bosque_propio', 'w-full': storedUserType !== 'client_bosque_propio' }">
                            <p class="text-green-700 font-semibold text-xl ml-5">Informes</p>
                            <div class="flex justify-between mt-4 px-4" v-for="report in userReportData">
                                <p class="text-gray-500">{{ getMonthName(report.report_date) }} <span>{{ extractYear(report.report_date) }}</span></p>
                                <div v-if="reportUrl != ''">
                                    <a :href="reportUrl" target="_blank" class="text-green-700 underline underline-offset-2 cursor-pointer">
                                        Abrir PDF
                                    </a>
                                </div>
                                <div v-else>
                                    <p class="text-gray-500 mt-4">No se encontraron informes</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-full z-0" v-if="storedUserType=='client_bosque_propio'">  
                            <standar-calendario :events="allEvents"/>
                        </div>
                    </div>
                </div>
                <div class="flex-col justify-between items-center inline-flex w-1/3">
                    <div class="p-[30px] mr-4 bg-white rounded-[20px] justify-center items-center gap-2.5 flex w-80"v-if="storedUserType=='client_bosque_propio'">
                        <div>
                            <img src="@/assets/IconsSvg/IconCalendar.svg" >
                        </div>
                        <div class="text-black text-xl font-normal">Mapa</div>
                    </div>
                    <div >
                        <div class=" bg-white rounded-[11px] justify-center items-center inline-flex mb-4 mt-4 w-80 cursor-pointer" @click="router.push('/clients/maps')" v-if="storedUserType=='client_bosque_propio'"> 
                            <div class="bg-white rounded-[35px]">
                                <div class="w-full px-2 py-6">
                                    <!-- <img src="@/assets/IconsSvg/ImageMapa.svg" > -->
                                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=4.485580,-75.726744&zoom=15&size=600x300&markers=color:red%7Clabel:A%7C40.748817,-73.985428&key=AIzaSyAHH2XDq9XEZKfmNJxO93bvHvjVN1XhS80" alt="Mapa estático de Google">
                                </div>
                            </div>
                        </div>
                        <div class="p-4 bg-white rounded-xl flex-col justify-center flex w-80">
                            <div class="flex flex-col justify-center content-center">
                                <div class="flex justify-center w-56 h-56 mx-auto bg-cover bg-center" :style="`background-image:url('${blogData?.image1}')`">
                                    <!-- <img v-if="blogData && blogData.image1" :src="blogData?.image1">
                                    <img v-else src="@/assets/Image/pistas-de-blue.jpg"> -->
                                </div>
                                <div class="flex-col justify-center items-start pt-1 flex ">
                                    <div class="self-stretch text-emerald-900 text-sm font-medium">{{ blogData?.title }}</div>
                                    <div class="text-green-600 text-[10.78px] font-normal  tracking-widest cursor-pointer" @click="router.push('/clients/blogClients')">Leer entrada</div> 
                                </div>
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

