<script setup lang="ts">
import { ref, onMounted } from 'vue';
import IconTreeomaLogo from '@/components/icons/IconTreeomaLogo.vue';
import { useRoute } from 'vue-router';
import { decryptDatos } from '@/stores/hub';
import { useAuthStore } from '@/stores/logVerify';

/* data */

const rutasAdmin = ['/admin/dashboard', '/admin/clientes', '/admin/predios'];  /* No se incluye porque va con el link de abajo '/admin/directores' */
const currentRoute = useRoute();
const storedUserType = ref<String>('');
const authStore = useAuthStore();

/* methods */

const userType = () => {
    storedUserType.value = decryptDatos(localStorage.getItem('userType') || '') ;
if (storedUserType.value !== null && storedUserType.value !== '') {
    return storedUserType;
}
return 'unknown';
}

const isActive = (to: string) => {
    return currentRoute.path.startsWith(to);
};

/* onMounted */
onMounted(async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await userType();
    }
});
</script>

<template>
    <div class="p-2">
        <nav class="flex justify-between h-[80px] shadow-lg rounded-[30px] bg-white">
            <div class="mt-4 ml-7 cursor-pointer" @click="$router.push('/admin/Dashboard')">
                <icon-treeoma-logo class="h-12" />
            </div>
            <ul class="flex items-center justify-around space-x-4 mr-7 cursor-pointer">
                <router-link v-for="(item, index) in rutasAdmin" :key="index" :to="item" class="font-medium cursor-pointer bg">
                    <li
                    :class="`px-5 py-3 rounded-[35px] justify-center items-center hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive(item) ? 'bg-green-900 text-white' : 'bg-white text-green-900'}`"
                    >
                        {{ item.split('/').slice(2).join(' ').toUpperCase() }}
                    </li>
                </router-link>
                <router-link v-if="storedUserType === 'admin'" to="/admin/directores" class="font-medium cursor-pointer bg" >
                    <li :class="`px-5 py-3 rounded-[35px] justify-center items-center hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/admin/directores') ? 'bg-green-900 text-white' : 'bg-white text-green-900'}`" >
                        DIRECTORES
                    </li>
                </router-link>
                <router-link to="/admin/informes" class="font-medium cursor-pointer bg" >
                    <li :class="`px-5 py-3 rounded-[35px] justify-center items-center hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/admin/informes') ? 'bg-green-900 text-white' : 'bg-white text-green-900'}`" >
                        INFORMES
                    </li>
                </router-link>
                <router-link to="/admin/blog" class="font-medium cursor-pointer bg" >
                    <li :class="`px-5 py-3 rounded-[35px] justify-center items-center hover:scale-105 hover:shadow-md focus-within:bg-white ${isActive('/admin/blog') ? 'bg-green-900 text-white' : 'bg-white text-green-900'}`" >
                        BLOG
                    </li>
                </router-link>
                <router-link to="" class="font-medium cursor-pointer bg" >
                    <li :class="`px-5 py-3 rounded-[35px] justify-center items-center hover:scale-105 hover:shadow-md focus-within:bg-white bg-white text-green-900`" @click="authStore.logout">
                        LOGOUT
                    </li>
                </router-link>
            </ul>
        </nav>
    </div>
</template>
