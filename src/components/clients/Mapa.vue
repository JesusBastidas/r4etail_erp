<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import usersApi from '@/stores/userApi';
import { useAuthStore } from '@/stores/logVerify'
import { decryptDatos } from '@/stores/hub';

/* data */
const authStore = useAuthStore();
const mapContainer = ref<HTMLElement | null>(null);
const latitude = ref<number>(4.424760);
const longitude = ref<number>(-75.147364);
const storedUserId = ref<Number>(0);
const userData = ref<UserData | null>(null);
const selectedPredio = ref<number>(0);
const predioData = ref<Predios | null>(null);

/* interface */

interface TreeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

interface Predio {
    id: number;
    predio_name: string;
    location: string;
    latitude: string;
    longitude: string;
}

interface UserData {
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
    predios: Predio[];
}

interface User {
    id: number;
    email: string;
    name: string | null;
    user_type: string;
    is_active: boolean;
}

interface Predios {
    id: number;
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
    latitude: string;
    longitude: string;
}

/* method */

const recoverUserId = () => {
    storedUserId.value = Number(localStorage.getItem("user_id"));
    if (storedUserId.value !== null && storedUserId.value !== 0) {
        return storedUserId;
    }
    return 0;
};

const loadMap = async (lat: number, long: number) => {
    try {
        const loader = new Loader({
            apiKey: 'AIzaSyDZGMwF3lX8-AIzaSyDZGMwF3lX8-Mur92IgFEfPcFRbprKR3Dc',
            version: 'weekly',
        });

        const google = await loader.load();
        if (mapContainer.value) {
            const map = new google.maps.Map(mapContainer.value, {
                center: { lat, lng: long },
                zoom: 15,
            });
            new google.maps.Marker({
                position: { lat, lng: long },
                map,
                title: 'Ubicacion',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const getUserData = async () => {
    try {
        const res = await usersApi.get(`/manager/clients/${storedUserId.value}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
        userData.value = res.data;
        
    } catch (error) {
        console.log(error);
    }
}

const getPredioData = async () => {
    try {
        const res = await usersApi.get(`/manager/predios/${selectedPredio.value}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
        predioData.value = res.data;
        if (predioData.value) {
            latitude.value = Number(predioData.value.latitude);
        }
        if (predioData.value) {
            longitude.value = Number(predioData.value.longitude);
        }
        loadMap(latitude.value, longitude.value);
    } catch (error) {
        console.log(error);
    }
}

/* lifecycle */

onMounted (async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        recoverUserId();
        await getUserData();
        await loadMap(latitude.value, longitude.value);
    }
})
</script>

<template>
    <div class="mx-[50px] mt-[50px]">
        <div>
            <div class="bg-green-700 rounded-2xl p-4 mt-4 flex justify-end mb-4" >
                <select class="rounded-l px-3 py-1" name="" id="" v-model="selectedPredio" @change="getPredioData()">
                    <option value="0">Seleccione un predio</option>
                    <option  :value="predio.id" v-for="predio in userData?.predios">{{ predio.predio_name }}</option>
                </select>
            </div>
            <div>
                <div ref="mapContainer" style="width: 100%; height: 400px;" >
                </div>
            </div>
        </div>
    </div>
</template>