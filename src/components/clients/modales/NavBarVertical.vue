<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { decryptDatos } from "@/stores/hub";
import { useAuthStore } from "@/stores/logVerify";

/* data */

const route = useRoute();
const storedUserType = ref<String>("");
const authStore = useAuthStore();

/* methods */

const userType = () => {
    storedUserType.value = decryptDatos(localStorage.getItem("userType") || "");
    if (storedUserType.value !== null && storedUserType.value !== "") {
        return storedUserType;
    }
    return "unknown";
};

const isActive = (to: string) => {
    return route.path.startsWith(to);
};

/* onMounted */
onMounted(() => {
    userType();
});
</script>

<template>
    <div class="w-[212px] h-screen bg-white shadow">
        <div class="h-dvh">
            <div class="py-10 px-5">
                <img src="@/assets/IconsSvg/IconLogoTreeoma.svg" alt="">
            </div>
            <div class="flex-col justify-start items-start ml-6 gap-[37px] inline-flex" >
                <div :class="`px-4 py-2 w-[154px] rounded-[35px] justify-start items-center gap-[26px] inline-flex hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/clients/main') ? 'bg-green-900 text-white' : 'bg-white text-green-900'} cursor-pointer`" @click="$router.push('/clients/main')">
                    <div class="w-6 h-6 relative rounded-full bg-white">
                        <img class="w-5 h-5 left-[2px] top-[2px] absolute" src="@/assets/IconsSvg/IconHomeClients.svg" />
                    </div>
                    <div class="text-gray-400 text-sm font-medium" >
                        <p>Inicio</p>
                    </div>
                </div>
                <div :class="`px-4 py-2 w-[154px] rounded-[35px] justify-start items-center gap-[26px] inline-flex hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/clients/payments') ? 'bg-green-900 text-white' : 'bg-white text-green-900'} cursor-pointer`" @click="$router.push('/clients/payments')">
                    <div class="w-6 h-6 relative rounded-full bg-white">
                        <img class="w-5 h-5 left-[2px] top-[2px] absolute rounded-full" src="@/assets/IconsSvg/IconPagosClienteVerde.svg" />
                    </div>
                    <div class="text-gray-400 text-sm font-medium" >
                        <p>Pagos</p>
                    </div>
                </div>
                <div :class="`px-4 py-2 w-[154px] rounded-[35px] justify-start items-center gap-[26px] inline-flex hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/clients/media') ? 'bg-green-900 text-white' : 'bg-white text-green-900'} cursor-pointer`" @click="$router.push('/clients/media')">
                    <div class="w-6 h-6 relative rounded-full bg-white">
                        <img class="w-5 h-5 left-[2px] top-[2px] absolute" src="@/assets/IconsSvg/IconMultimediaClientVerde.svg" />
                    </div>
                    <div class="text-gray-400 text-sm font-medium" >
                        <p>Multimedia</p>
                    </div>
                </div>
                <div :class="`px-4 py-2 w-[154px] rounded-[35px] justify-start items-center gap-[26px] inline-flex hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/clients/maps') ? 'bg-green-900 text-white' : 'bg-white text-green-900'} cursor-pointer`" @click="$router.push('/clients/maps')" v-if="storedUserType=='client_bosque_propio'">
                    <div class="w-6 h-6 relative rounded-full bg-white">
                        <img class="w-5 h-5 left-[2px] top-[2px] absolute" src="@/assets/IconsSvg/IconMapaClienteVerde.svg" />
                    </div>
                    <div class="text-gray-400 text-sm font-medium" >
                        <p>Mapa</p>
                    </div>
                </div>
                <div :class="`px-4 py-2 w-[154px] rounded-[35px] justify-start items-center gap-[26px] inline-flex hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/clients/support') ? 'bg-green-900 text-white' : 'bg-white text-green-900'} cursor-pointer`" @click="$router.push('/clients/support')">
                    <div class="w-6 h-6 relative rounded-full bg-white">
                        <img class="w-[19px] h-5 left-[2.50px] top-[2px] absolute" src="@/assets/IconsSvg/IconSporteClienteVerde.svg" />
                    </div>
                    <div class="text-gray-400 text-sm font-medium" >
                        <p>Soporte</p>
                    </div>
                </div>
                <div :class="`px-4 py-2 rounded-[35px] justify-start items-center gap-[26px] inline-flex hover:scale-105 hover:shadow-md focus-within:bg-white`">
                    <div class="w-6 h-6 relative rounded-full bg-white">
                        <img class="w-[20.78px] h-5 left-[2px] top-[2px] absolute" src="@/assets/IconsSvg/IconLogout.svg" />
                    </div>
                    <div class="text-gray-400 text-sm font-medium cursor-pointer" >
                        <p @click="authStore.logout">Log out</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
