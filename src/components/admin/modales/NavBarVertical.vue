<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { decryptDatos } from '@/stores/hub';

/* data */

const router = useRouter();
const storedUserType = ref<String>('');


/* methods */

const userType = () => {
    storedUserType.value = decryptDatos(localStorage.getItem('userType') || '') ;
if (storedUserType.value !== null && storedUserType.value !== '') {
    return storedUserType;
}
return 'unknown';
}


/* onMounted */
onMounted(() => {
    userType();
});

</script>

<template>
    <div class="w-[65px] h-[656px] pl-3.5 pr-[15px] pt-[164px] pb-[182px] bg-white rounded-[50px] flex-col justify-start items-center inline-flex">
        <div class="flex-col justify-between items-center gap-20 inline-flex">
            <div class="flex-col justify-start items-center gap-[5px] flex cursor-pointer" v-if="storedUserType=='admin'" @click="router.push('/admin/clientes')">
                <div class="w-6 h-6 relative">
                    <div class="w-6 h-6 left-0 top-0 absolute bg-white hover:scale-105" >
                        <img src="@/assets/IconsSvg/IconCrearCliente.svg">
                    </div>
                </div>
                <div class="text-center text-emerald-600 text-[10px] font-light">Crear<br/>Cliente</div>
            </div>
            <div class="flex-col justify-start items-center gap-[5px] flex cursor-pointer" @click="router.push('/admin/predios')">
                <div class="w-6 h-6 relative">
                    <div class="w-6 h-6 left-0 top-0 absolute bg-white">
                        <img src="@/assets/IconsSvg/IconCrearPredio.svg">
                    </div>
                </div>
                <div class="w-[29px] text-center text-emerald-600 text-[10px] font-light">Crear<br/>Predio</div>
            </div>
            <div class="flex-col justify-start items-center gap-[5px] flex cursor-pointer" v-if="storedUserType=='admin'" @click="router.push('/admin/directores')">
                <div class="w-6 h-6 relative">
                    <div class="w-6 h-6 left-0 top-0 absolute bg-white">
                        <img src="@/assets/IconsSvg/IconCrearDirector.svg">
                    </div>
                </div>
                <div class="text-center text-emerald-600 text-[10px] font-light">Crear<br/>Director</div>
            </div>
            <div class="flex-col justify-start items-center gap-[5px] flex cursor-pointer" v-if="storedUserType=='director_of_operations'" @click="router.push('/admin/informes')">
                <div class="w-6 h-6 relative">
                    <div class="w-6 h-6 left-0 top-0 absolute bg-white">
                        <img src="@/assets/IconsSvg/IconCrearInforme.svg">
                    </div>
                </div>
                <div class="text-center text-emerald-600 text-[10px] font-light">Crear<br/>Informe</div>
            </div>
        </div>
    </div>
</template>