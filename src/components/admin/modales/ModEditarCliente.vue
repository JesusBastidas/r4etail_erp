<script setup lang="ts">
import { ref, onMounted } from 'vue';
import IconClose from '@/components/icons/IconClose.vue';
import  { showToast, POSITION } from '@/stores/toast';
import usersApi from '@/stores/userApi';
import { decryptDatos } from '@/stores/hub';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';
import ModTiposArbol from '@/components/admin/modales/ModTiposArbol.vue';
import ModListarPrediosCliente from '@/components/admin/modales/ModListarPrediosCliente.vue';
import Spinner from '@/components/shared/Spinner.vue';

/* data */
const bosquePropio = ref<Boolean> (true) || undefined;
const bosqueColectivo = ref<Boolean> (false) || undefined;

const singleUserData = ref<userDataCreate>({
    client_type: '',
    company_name: '',
    contact_name: '',
    phone: '',
    address: '',
    email: '',
    industry: '',
    tree_quantity: 0,
    months_paid: 0,
    end_date: '',
    tree_types: [],
    RUT: '',
    payment_proof: '',
    chamber_of_commerce: '',
    logo: '',
});

const Industries = ref([
    { value: "agriculture", label: "Agricultura" },
    { value: "fishing", label: "Pesca" },
    { value: "forestry", label: "Silvicultura" },
    { value: "food_and_nutrition", label: "Alimentación" },
    { value: "beverages", label: "Bebidas" },
    { value: "cosmetics", label: "Cosméticos" },
    { value: "home_equipment", label: "Electrodomésticos" },
    { value: "toys", label: "Juguetes" },
    { value: "pets", label: "Mascotas" },
    { value: "cleaning_products", label: "Productos de limpieza" },
    { value: "home_renovation", label: "Remodelación del hogar" },
    { value: "clothing", label: "Indumentaria" },
    { value: "tobacco", label: "Tabaco" },
    { value: "e_commerce", label: "Comercio electrónico" },
    { value: "wholesale", label: "Venta al por mayor" },
    { value: "international_trade", label: "Comercio internacional" },
    { value: "sports_and_leisure", label: "Deportes y ocio" },
    { value: "electronics", label: "Electrónica" },
    { value: "office_supplies", label: "Artículos de oficina" },
    { value: "furniture", label: "Muebles" },
    { value: "fashion_accessories", label: "Accesorios de moda" },
    { value: "health_and_hygiene", label: "Salud e higiene" },
    { value: "construction", label: "Construcción" }, 
    { value: "architecture", label: "Arquitectura" },
    { value: "civil_engineering", label: "Ingeniería civil" },
    { value: "sports_and_fitness", label: "Deportes y fitness" },
    { value: "gambling", label: "Juegos de azar" },
    { value: "outdoor_activities", label: "Actividades al aire libre" },
    { value: "energy_and_environment", label: "Energía y medio ambiente" },
    { value: "water_and_waste", label: "Agua y residuos" },
    { value: "emissions", label: "Emisiones" },
    { value: "energy", label: "Energía" },
    { value: "environmental_technology", label: "Tecnología ambiental" },
    { value: "waste_management", label: "Gestión de residuos" },
    { value: "finance", label: "Finanzas" },
    { value: "insurance", label: "Seguros" },
    { value: "real_estate", label: "Bienes raíces" },
    { value: "financial_services", label: "Servicios financieros" },
    { value: "other", label: "Otro" },
]);

const props = defineProps({
    close: { type: Function },
    forestType: { type: String },
    cambioBosque: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    clientId: { type: Number },
    });

/* dataFiles */
const rutFile = ref<File | null>(null);
const camaraComercioFile = ref<File | null>(null);
const pruebaPago = ref<File | null>(null);
const userLogo = ref<File | null>(null);
const prediosList = ref<Number[]>();
const treeType = ref<treeType[]>()
const openTipoArbolModal = ref<Boolean>(false);
const openListaPredios = ref<Boolean>(false);
const numPrediosElegidos = ref<number>(0);
const spinner = ref<Boolean>(false);

/* interfaces */

interface userDataCreate {
    client_type: string;
    company_name: string;
    contact_name: string;
    phone: string;
    address: string;
    email: string;
    industry: string;
    tree_quantity: number;
    months_paid: number;
    end_date: string;
    tree_types: string[];
    RUT: string;
    payment_proof: string;
    chamber_of_commerce: string;
    logo: string;
}
interface treeType {
    tree_type: number;
    tree_type_name?: string;
    quantity: number;
}

/* methods */

const deselect = (selectedName: string) => {
    if (selectedName == 'bosquePropio') {
        bosqueColectivo.value = false;
    }else if (selectedName == 'bosqueColectivo') {
        bosquePropio.value = false;
    }
}

const closeModal = () => {
    openTipoArbolModal.value = false;
    openListaPredios.value = false;
}

const openTipoArbolMod = () => {
    openTipoArbolModal.value = true;
}

const getUserDetail = async () => {
    spinner.value = true;
    try {
        const res = await usersApi.get(`/manager/clients/${props.clientId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        singleUserData.value = {
            client_type: res.data.client_type,
            company_name: res.data.company_name,
            contact_name: res.data.contact_name,
            phone: res.data.phone,
            address: res.data.address,
            email: res.data.email,
            industry: res.data.industry,
            tree_quantity: res.data.tree_quantity,
            months_paid: res.data.months_paid,
            end_date: res.data.end_date,
            tree_types: res.data.tree_types,
            RUT: res.data.RUT,
            payment_proof: res.data.payment_proof,
            chamber_of_commerce: res.data.chamber_of_commerce,
            logo: res.data.logo,
        }
        spinner.value = false;
    } catch (error) {
        spinner.value = false;
        showToast('No se pudo recuperar información del cliente', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const editSingleClient = async () => {
    const formData = new FormData();
    formData.append('client_type', bosquePropio.value ? 'client_bosque_propio' : 'client_bosque_compartido');
    formData.append('company_name', singleUserData.value.company_name);
    formData.append('contact_name', singleUserData.value.contact_name);
    formData.append('phone', singleUserData.value.phone);
    formData.append('address', singleUserData.value.address);
    formData.append('email', singleUserData.value.email);
    formData.append('industry', singleUserData.value.industry);
    formData.append('tree_quantity', singleUserData.value.tree_quantity.toString());
    formData.append('months_paid', singleUserData.value.months_paid.toString());
    formData.append('tree_types', JSON.stringify(singleUserData.value.tree_types));
    formData.append('end_date', singleUserData.value.end_date);
    formData.append('predios', JSON.stringify(prediosList.value));
    if (rutFile.value) {
        formData.append('RUT', rutFile.value);
    }
    if (camaraComercioFile.value) {
        formData.append('chamber_of_commerce', camaraComercioFile.value);
    }
    if (pruebaPago.value) {
        formData.append('payment_proof', pruebaPago.value);
    }
    if (userLogo.value) {
        formData.append('logo', userLogo.value);
    }
    try {
        spinner.value = true;
        const response = await usersApi.patch(`/manager/clients/${props.clientId}/`, 
            formData,
            {
            headers: {
                    Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
                },
        });
        spinner.value = false;
        showToast('Cambios guardados correctamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onClick();
    } catch (error) {
        spinner.value = false;
        showToast('No se ha podido editar la información del cliente', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

const deactivateClient = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.delete(`/manager/clients/${props.clientId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        spinner.value = false;
        props.onClick();
        showToast('Cliente desactivado correctamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
    } catch (error) {
        showToast('No se ha podido desactuivar el cliente', 'error', 3000, POSITION.BOTTOM_RIGHT);
        spinner.value = false;
    }
}

/* onMounted */

onMounted( async () => {
    await getUserDetail();
});

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[250px]" :class="`bg-white`">
            <div class="flex justify-between">
                <div class="flex">
                    <h1 class="text-start mb-2 mt-2 text-sm font-semibold" :class="`text-green-900`" v-if="props.title">
                        {{ singleUserData.company_name }}
                    </h1>
                </div>
                <div class="p-2 flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
            </div>
            <div class="flex">
                <p class="text-start my-2 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                    {{ props.subTitle }}
                </p>
            </div>
            <div class="flex">
                <div class="flex">
                    <input type="checkbox" v-model="bosquePropio" @change="deselect('bosquePropio')">
                    <p class="ml-2 text-green-800">Bosque Propio</p>
                </div>
                <div class="flex ml-4">
                    <input type="checkbox" v-model="bosqueColectivo" @change="deselect('bosqueColectivo')">
                    <p class="ml-2 text-green-800">Bosque Colectivo</p>
                </div>
            </div>
            <div>
                <div class="flex">
                    <div class="mx-2">
                        <div class="my-2">
                            <p>Nombre de la empresa</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Usuario" v-model="singleUserData.company_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Correo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="email" v-model="singleUserData.email">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Industria</p>
                            <select class="outline-none border rounded-[35px] px-2 py-1" v-model="singleUserData.industry">
                                <option>Selecciona...</option>
                                <option v-for="industry in Industries" :value="industry.value">{{ industry.label }}</option>
                            </select>                              
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Numero de meses contratados</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Meses contratados" v-model="singleUserData.months_paid">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Numero de arboles</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Meses contratados" v-model="singleUserData.tree_quantity">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Logo de la empresa</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> userLogo=files[0]" />
                            </div>
                        </div>
                        <div class="mb-2" v-if="bosquePropio">
                            <p class="mb-2">RUT</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> rutFile=files[0]" />
                            </div>
                        </div>
                        <div>
                            <p class="mb-2 font-semibold text-green-700 cursor-pointer" @click="openTipoArbolMod()">Tipos de arbol</p>
                        </div>
                    </div>
                    <div class="mx-2">
                        <div class="my-2">
                            <p>Nombre del encargado</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Usuario" v-model="singleUserData.contact_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Celular</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="number" placeholder="Movil" v-model="singleUserData.phone">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Dirección</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="text" placeholder="Dirección" v-model="singleUserData.address">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Fecha de finalizacion del contrato</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1" type="date" placeholder="Dirección" v-model="singleUserData.end_date">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Prueba de pago</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> pruebaPago=files[0]" />
                            </div>
                        </div>
                        <div class="mb-2" v-if="bosquePropio">
                            <p class="mb-2">Cámara de comercio</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> camaraComercioFile=files[0]" />
                            </div>
                        </div>
                        <div>
                            <p class="mb-2 font-semibold text-green-700 cursor-pointer" @click="openListaPredios=true">Lista de predios</p>
                            <p class="text-green-700 font" v-if="numPrediosElegidos">Acabas de seleccionar {{ numPrediosElegidos }} predios</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-around">
                <button class="px-7 py-1 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="editSingleClient">{{props.butText}}</button>
                <button class="px-4 mt-4 text-green-700 border border-green-700 rounded-[35px]" v-if="props.onCancel" @click="deactivateClient">Desactivar cliente</button>
            </div>
            <div>
                <mod-tipos-arbol v-if="openTipoArbolModal" :close="closeModal" :title="'Tipos de arbol'" :subTitle="'Selecciona los tipos de arbol a plantar'" butText="Guardar cambios" :onClick="closeModal" :onCancel="closeModal" :sendTrees="(e: any) => treeType = e"/>
            </div>
            <div>
                <mod-listar-predios-cliente v-if="openListaPredios" :close="closeModal" :title="'Predios disponibles'" :subTitle="'Selecciona los predios disponibles para el cliente'" butText="Guardar" :onClick="closeModal" :onCancel="closeModal" :sendPredios="(i: any) => prediosList = i" :sendNumPredios="(x: any) => numPrediosElegidos = x"/>
            </div>
        </div>
        <spinner v-if="spinner" />
    </div>
</template>

<style scoped>
input[type="checkbox"] {
    accent-color: green;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

</style>

