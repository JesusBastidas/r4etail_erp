<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/logVerify';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import usersApi from '@/stores/userApi';
import ModCrearCliente from '@/components/admin/modales/ModCrearCliente.vue';
import ModDetallesCliente from '@/components/admin/modales/ModDetallesCliente.vue';
import ModEditarCliente from '@/components/admin/modales/ModEditarCliente.vue';
import ModPagosCliente from '@/components/admin/modales/ModPagosCliente.vue';
import Spinner from '@/components/shared/Spinner.vue';
import ModListaPrediosClient from '@/components/admin/modales/ModListaPrediosClient.vue';

/* data */
const bosquePropio = ref<Boolean> (true) || undefined;
const bosqueColectivo = ref<Boolean> (false) || undefined;
const authStore = useAuthStore();
const modal = ref<Boolean>(false) || undefined;
const clientDetails = ref<Boolean>(false) || undefined;
const modalEdit = ref<Boolean>(false) || undefined;
const allClients = ref<clients[]>([]);
const clientId = ref<number>(0);
const clientPayments = ref<Boolean>(false) || undefined;
const spinner = ref<Boolean>(false);
const modPrediosDash = ref<Boolean>(false);


/* interfaces */

interface clients {
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
    tree_types: treeType[];
    tree_quantity: number;
    payment_proof: string;
    months_paid: number;
    start_date: string;
    end_date: string;
}

interface treeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

/* methods */

const cambioBosque = () => {
    if (bosquePropio.value == true) {
        bosquePropio.value = !bosquePropio.value;
        bosqueColectivo.value = !bosqueColectivo.value;
    } else {
        bosquePropio.value = !bosquePropio.value;
        bosqueColectivo.value = !bosqueColectivo.value;
    }
}

const closeModal1 = () => {
    modal.value = false;
    clientDetails.value = false;
    modalEdit.value = false;
    clientPayments.value = false;
    modPrediosDash.value = false;
}

const closeModal2 = () => {
    clientDetails.value = false;
}

const closeModal3 = () => {
    modalEdit.value = false;
}

const closeModal4 = () => {
    clientPayments.value = false;
}
const editClient = () => {
    clientDetails.value = false;
    modalEdit.value = true;
}

const openDetails = (id: number) => {
    clientId.value = id
    clientDetails.value = true;
}

const openPayments = (id: number) => {
    clientId.value = id
    clientPayments.value = true;
}

const openProperty = (id: number) => {
    clientId.value = id
    modPrediosDash.value = true;
}

const deactivateClient = () => {
    console.log('deactivateClient');
}

const getClients = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get('/manager/clients/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        })
        spinner.value = false;
        allClients.value = response.data;
    } catch (error: any) {
        spinner.value = false;
        showToast('No se pudo recuperar la información de los clientes', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const createClient = () => {
    getClients();
    setTimeout(closeModal1, 1000)
}

const editClientfunction = () => {
    getClients();
    setTimeout(closeModal3, 1000)
}

/* mounted */

onMounted( async() => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await getClients();
    }
})

/* computed */

const filteredClients = computed (() => {
    if (bosquePropio.value) {
        return allClients.value?.filter((c) => c.client_type === 'client_bosque_propio');
    } 
    if (bosqueColectivo.value) {
        return allClients.value?.filter((c) => c.client_type === 'client_bosque_compartido');
    }
})

</script>

<template>
    <div class="bg-white my-5 mx-3 rounded-[30px]">
        <div class="flex justify-between py-3 px-5 border-b-2">
            <div class="flex content-center justify-center pl-3">
                <p :class="`mr-10 mt-2 text-green-600 cursor-pointer tracking-[2.70px] hover:scale-105 ${bosquePropio ? 'font-semibold text-green-900' : 'text-green-600'}`"  @click="cambioBosque()">BOSQUE PROPIO</p>
                <p :class="`mt-2 text-green-600 cursor-pointer tracking-[2.70px] hover:scale-105 ${bosquePropio ? 'text-green-600' : 'font-semibold text-green-900'}`" @click="cambioBosque()">BOSQUE COLECTIVO</p>
            </div>
            <button class="bg-emerald-900 px-5 py-2 rounded-[35px] text-white cursor-pointer hover:scale-105" @click="modal=true">Crear Cliente +</button>
        </div>
        <div class="pb-5">
            <div>
                <div class="flex justify-between mx-9 text-neutral-500">
                    <p class="w-1/5">Nombre de la empresa</p>
                    <p class="w-1/5">Número de arboles</p>
                    <p class="w-1/5">Predios</p>
                    <p class="w-1/5">Historial de pago</p>
                    <div class="w-1/5"></div>
                </div>
            </div>
            <div class="cursor-pointer justify-center items-center" v-for="(cliente, index) in filteredClients" key="cliente">
                <div class="flex justify-between justify-items-center items-center content-center mx-10 px-5 py-5 text-emerald-900" :class="{ 'bg-green-100 rounded-3xl': index % 2 === 0 }">
                    <div class="flex flex-col w-1/6">
                        <p>{{ cliente.company_name }}</p>
                    </div>
                    <div class="w-1/5">{{ cliente.tree_quantity }} árboles</div>
                    <div class="w-1/5 font-semibold text-green-600 hover:scale-105" @click="openProperty(cliente.user_account_id)">Ver predios</div>
                    <div class="w-1/5 font-semibold text-green-600 hover:scale-105" @click="openPayments(cliente.user_account_id)">Ver historial</div>
                    <button class="border border-green-900 rounded-[35px] text-emerald-900 px-3 cursor-pointer hover:scale-105 font-semibold w-1/5" @click="openDetails(cliente.user_account_id)">Ver detalles</button>
                </div>
            </div>
            <div>
                <mod-crear-cliente v-if="modal" :close="closeModal1" :cambioBosque="cambioBosque" title="CREAR CLIENTE" subTitle="Escoja el tipo de plan que desea el cliente" :onClick="createClient" butText="Crear Cliente" :bosquePropio="bosquePropio"/>
            </div>
            <div>
                <mod-detalles-cliente v-if="clientDetails" :forestType="'Bosque propio'" title="Nombre empresa" subTitle="Bosquecito" :onClick="editClient" butText="Editar" :on-cancel="closeModal2" :clientId="clientId"/>
            </div>
            <div>
                <mod-editar-cliente v-if="modalEdit" title="EDITAR CLIENTE" subTitle="Escoja el tipo de plan que desea el cliente" :onClick="editClientfunction" butText="Guardar cambios" :close="closeModal3" :on-cancel="deactivateClient" :clientId="clientId"/>
            </div>
            <div>
                <mod-pagos-cliente v-if="clientPayments" title="HISTORIAL DE PAGOS" :close="closeModal4" :clientId="clientId"/>
            </div>
            <div>
                <mod-lista-predios-client v-if="modPrediosDash" :clientId="clientId" :close="closeModal1" />
            </div>
        </div>
        <div>
            <spinner v-if="spinner" />
        </div>
    </div>
</template>