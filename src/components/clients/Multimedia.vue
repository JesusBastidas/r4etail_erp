<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import usersApi from "@/stores/userApi";
import { decryptDatos } from '@/stores/hub';
import  { showToast, POSITION } from '@/stores/toast';

/* data */
const storedUserId = ref<Number>();
const userReportData = ref<UserReport>();


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
    drive_url: string;
}
/* methods */

const recoverUserId = () => {
    storedUserId.value = Number(localStorage.getItem("user_id"));
    if (storedUserId.value !== null && storedUserId.value !== 0) {
        return storedUserId;
    }
    return 0;
};


const getAllReports = async () => {
    try {
        const res = await usersApi.get(`/operations/reports/?client=${storedUserId.value}`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        userReportData.value = res.data[0];
    } catch (error) {
        showToast('No se pudo recuperar la información del usuario', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
};

function formatUrl(url: string | undefined): string {
    if (!/^https?:\/\//i.test(url ?? '')) {
        return 'https://' + (url ?? '');
    }
    return url ?? '';
}

const formattedUrl = computed(() => formatUrl(userReportData.value?.drive_url));

const openImage = (url: string) => {
    window.open(url, '_blank');
}


/* lifecicle */

onMounted(async () => {
    recoverUserId()
    await getAllReports();
})
</script>

<template>
    <div class="mx-[50px] mt-[50px]">
        <div class="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" >
            <div v-for="imagen in userReportData?.multimedia">
                <img class="object-cover rounded-xl h-[300px] w-[300px] cursor-pointer" :src="imagen.photo" @click="openImage(imagen.photo)">
            </div>
        </div>
        <div class="py-5" v-if="userReportData && userReportData.drive_url != null">
            <h3 class="text-3xl font-semibold text-green-700">En el siguiente link puedes encontrar todas las fotos</h3>
            <a class="text-green-700 font-semibold text-2xl hover:scale-105" target="_blank" :href="formattedUrl">{{  userReportData.drive_url }}</a>
        </div>
    </div>
</template>

<style scoped>

.img {
    max-width: 100%;
    height: auto;
}
</style>