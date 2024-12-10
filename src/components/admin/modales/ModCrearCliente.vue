<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import IconClose from '@/components/icons/IconClose.vue';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';
import usersApi from '@/stores/userApi';
import ModTiposArbol from '@/components/admin/modales/ModTiposArbol.vue';
import ModListarPrediosCliente from '@/components/admin/modales/ModListarPrediosCliente.vue';
import Spinner from '@/components/shared/Spinner.vue';


/* data */

const bosquePropio = ref<Boolean> (true) || undefined;
const bosqueColectivo = ref<Boolean> (false) || undefined;
const userDataCreate = ref<userDataCreate>({
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
const numPrediosElegidos = ref<Number>();
const prediosList = ref<Number[]>();
const treeType = ref<treeType[]>()
const openTipoArbolModal = ref<Boolean>(false);
const openListaPredios = ref<Boolean>(false);
const spinner = ref<Boolean>(false);


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


/* interface */

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
    tree_types: treeType[];
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

interface User {
    id: number;
    email: string;
    name: string | null;
    user_type: string;
    is_active: boolean;
}

interface Predio {
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
}

/* dataDocuments */

const rutFile = ref<File | null>(null);
const camaraComercioFile = ref<File | null>(null);
const pruebaPago = ref<File | null>(null);
const userLogo = ref<File | null>(null);
const addContract = ref<File | null>(null);
const buttonClicked = ref<Boolean>(false);


const props = defineProps({
    close: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    });

/* methods */

const cambioBosques = () => {
    if (bosquePropio.value == true) {
        bosquePropio.value = !bosquePropio.value;
        bosqueColectivo.value = !bosqueColectivo.value;
    } else {
        bosquePropio.value = !bosquePropio.value;
        bosqueColectivo.value = !bosqueColectivo.value;
    }
}

const closeModal = () => {
    openTipoArbolModal.value = false;
    openListaPredios.value = false;
}

const openTipoArbolMod = () => {
    openTipoArbolModal.value = true;
}

const createNewUser = async () => {
    const formData = new FormData();
    formData.append('client_type', bosquePropio.value ? 'client_bosque_propio' : 'client_bosque_compartido');
    formData.append('company_name', userDataCreate.value.company_name);
    formData.append('contact_name', userDataCreate.value.contact_name);
    formData.append('phone', userDataCreate.value.phone);
    formData.append('address', userDataCreate.value.address);
    formData.append('email', userDataCreate.value.email);
    formData.append('industry', userDataCreate.value.industry);
    formData.append('tree_quantity', userDataCreate.value.tree_quantity.toString());
    formData.append('months_paid', userDataCreate.value.months_paid.toString());
    formData.append('tree_types', JSON.stringify(treeType.value));
    formData.append('end_date', userDataCreate.value.end_date);
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
        const response = await usersApi.post('/manager/clients/', 
            formData,
            {
            headers: {
                    Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
                },
        });
        spinner.value = false;
        showToast('Cliente creado exitosamente', 'success', 3000, POSITION.BOTTOM_RIGHT);
        props.onClick();
        buttonClicked.value = true; /* probar esta cosa */
    } catch (error) {
        spinner.value = false;
        showToast('error', 'error', 3000, POSITION.BOTTOM_RIGHT);
    }
}

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[400px] min-h-[470px]" :class="`bg-white`">
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
                <!-- <span v-if="prediosList">{{ prediosList }}</span>
                <span v-if="treeType">{{ treeType }}</span> -->
            </p>
            <div>
                <div class="flex justify-start content-center mb-4">
                    <p :class="`mr-4 mt-2 text-green-600 cursor-pointer hover:scale-105 ${bosquePropio ? 'font-semibold text-green-900' : 'text-green-600'} text-xs`"  @click="cambioBosques">BOSQUE PROPIO</p>
                    <p :class="`mt-2  text-green-600 cursor-pointer hover:scale-105 ${bosquePropio ? 'text-green-600' : 'font-semibold text-green-900'} text-xs`" @click="cambioBosques">BOSQUE COLECTIVO</p>
                </div>
                <div class="flex">
                    <div class="mx-2">
                        <div class="my-2">
                            <p class="mb-2">Nombre de la empresa</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" placeholder="Usuario" v-model="userDataCreate.company_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Correo</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="email" placeholder="email" v-model="userDataCreate.email">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Industria</p>
                            <select class="outline-none border rounded-[35px] px-2 py-1" v-model="userDataCreate.industry">
                                <option>Selecciona...</option>
                                <option v-for="industry in Industries" :value="industry.value">{{ industry.label }}</option>
                            </select>                              
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Numero de meses contratados</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="number" placeholder="Meses contratados" v-model="userDataCreate.months_paid">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Numero de arboles</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="number" placeholder="Meses contratados" v-model="userDataCreate.tree_quantity">
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
                            <p class="mb-2">Nombre del encargado</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" placeholder="Usuario" v-model="userDataCreate.contact_name">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Celular</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="number" placeholder="Movil" v-model="userDataCreate.phone">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Dirección</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" placeholder="Dirección" v-model="userDataCreate.address">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Fecha de finalizacion del contrato</p>
                            <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="date" placeholder="Dirección" v-model="userDataCreate.end_date">
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Prueba de pago</p>
                            <div class="w-full">
                                <standar-add-documents @file-list="(files: File[])=> pruebaPago=files[0]" />
                            </div>
                        </div>
                        <div class="mb-2">
                            <p class="mb-2">Agregar contrato</p>
                            <div>
                                <standar-add-documents @file-list="(files: File[])=> addContract=files[0]" />
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
            <div class="flex">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" :disabled="buttonClicked" v-if="props.onClick" @click="createNewUser">{{props.butText}}</button>
                <button class="px-4 mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
            </div>
            <div>
                <mod-tipos-arbol v-if="openTipoArbolModal" :close="closeModal" :title="'Tipos de arbol'" :subTitle="'Selecciona los tipos de arbol a plantar'" butText="Guardar cambios" :onClick="closeModal" :onCancel="closeModal" :sendTrees="(e: any) => treeType = e"/>
            </div>
            <div>
                <mod-listar-predios-cliente v-if="openListaPredios" :close="closeModal" :title="'Predios disponibles'" :subTitle="'Selecciona los predios disponibles para el cliente'" butText="Guardar" :onClick="closeModal" :onCancel="closeModal" :sendPredios="(i: any) => prediosList = i" :sendNumPredios="(x: any) => numPrediosElegidos = x"/>
            </div>
        </div>
        <div>
            <spinner v-if="spinner" />
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
