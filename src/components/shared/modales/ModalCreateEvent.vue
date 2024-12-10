<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '@/stores/toast';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';

const props = defineProps({
    closeModal: {
        type: Function,
        required: true
    },
    addEvent: {
        type: Function,
        required: true
    },
    recargarAgenda: {
        type: Function,
        required: true
    }
})

/* data */

const tittle = ref<String>('')
const predio = ref<Number>()
const tipoEvento = ref<String>('')
const fecha = ref(new Date("yyyy-MM-dd"));
const hora = ref('')
const invitados = ref<Array<any>>([])
const allPropertiesData = ref<Predios[]>()
const allClientsData = ref<UserAccounts[]>()
const treesPlanted = ref<Number>(0)
const spinner = ref<Boolean>(false)


/* interfaces */

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
}

interface TreeType {
    tree_type: number;
    tree_type_name: string;
    quantity: number;
}

interface UserAccounts {
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
    predios: any[];
}

/* methods */

const todayDate = computed (()=> new Date())
const fechaHoy = ref(todayDate)
const fechaHoyNueva = new Date("yyyy-MM-dd")


function handleSubmit() {
    
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses de 0-11, así que sumamos 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


const handleInvitadoChange = (event: Event) => {
    const selectedId = event.target ? Number(event.target.value) : 0;
    if (selectedId && !invitados.value.includes(selectedId)) {
        invitados.value.push(selectedId);
    }
    console.log(invitados.value)
};


const allProperties = async () => {
    try {
        const response = await usersApi.get('/manager/predios/', {
        headers: {
            Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
        }
    })
    allPropertiesData.value = response.data
    } catch (error) {
        showToast('No se logro recuperar información de predios', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
}

const getClients = async () => {
    try {
        const response = await usersApi.get('/manager/clients/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        allClientsData.value = response.data
        console.log(response.data)
    } catch (error) {
        showToast('No se logro recuperar información de clientes', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
}

const addEvent = async () => {
    spinner.value = true
    try {
        const response = await usersApi.post('/operations/event/', {
            title: tittle.value,
            location: predio.value,
            trees_planted: treesPlanted.value,
            event_type: tipoEvento.value,
            event_day: fecha.value.toString(),
            event_hour: hora.value,
            attendees: invitados.value
        }, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        spinner.value = false
        console.log(response.data)
        showToast('Evento creado con éxito', 'success', 3000, POSITION.BOTTOM_RIGHT)
        props.recargarAgenda()
        props.closeModal()
    } catch (error) {
        spinner.value = false
        showToast('No se logro crear el evento', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
}

/* lifecycle */
onMounted(() => {
    allProperties()
    getClients()
})

</script>
<template>
    <div class="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg overflow-hidden w-1/2 max-w-md">
            <div class="px-4 py-3 bg-white flex justify-between">
                <h2 class="text-lg font-bold text-green-600">Agendar Eventos</h2>
                <button @click="props.closeModal" class="close-button focus:outline-none">
                    <div class="w-5 h-5 relative">
                        <img src="@/assets/IconsSvg/IconCancel.svg" alt="Cerrar" class="w-5 h-5" />
                    </div>
                </button>
            </div>
            <div class="p-4">
                <div class="flex flex-col space-y-2">
                    <div class="flex flex-col space-y-1">
                        <label for="predio" class="text-xs font-medium text-green-600">Título</label>
                        <input v-model="tittle" type="text" id="titulo" name="titulo" class="input-field bg-green-50" placeholder="Titulo del evento">
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label for="predio" class="text-xs font-medium text-green-600">Predio</label>
                        <select v-model="predio" type="text" id="predio" name="predio" class="input-field bg-green-50" placeholder="Ubicacion">
                            <option v-for="predio in allPropertiesData" :key="predio.id" :value="predio.id">{{ predio.predio_name }} </option>
                        </select>
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label for="tipo-evento" class="text-xs font-medium text-green-600">Tipo de Evento</label>
                        <select v-model="tipoEvento" id="tipo-evento" name="tipo-evento"
                            class="input-field bg-green-50">
                            <option value="">Seleccionar tipo de evento</option>
                            <option value="siembra">Siembra</option>
                            <option value="mantenimiento">Mantenimiento...</option>
                        </select>
                    </div>
                    <div>
                        <label for="treesPlanted" class="text-xs font-medium text-green-600">Árboles</label>
                        <input v-model="treesPlanted" type="number" id="treesPlanted" name="treesPlanted" class="input-field bg-green-50">
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label for="fecha" class="text-xs font-medium text-green-600">Fecha</label>
                        <input v-model=fecha type="date" id="fecha" name="fecha" class="input-field bg-green-50" :min="getCurrentDate()">
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label for="hora" class="text-xs font-medium text-green-600">Hora</label>
                        <input v-model="hora" type="time" id="hora" name="hora" class="input-field bg-green-50">
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label for="invitados" class="text-xs font-medium text-green-600">Invitado</label>
                        <select id="invitados" name="invitados" class="input-field bg-green-50" @change="handleInvitadoChange($event)">
                            <option value="">Seleccionar invitado</option>
                            <option v-for="client in allClientsData" :key="client.user_account_id" :value="client.user_account_id">{{ client.company_name }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 bg-white flex justify-end">
                <div @click="addEvent()"
                    class="cursor-pointer flex items-center justify-center w-32 h-10 bg-emerald-900 rounded-full">
                    <div class="text-white text-xs font-medium tracking-wider">Guardar cambios</div>
                </div>
            </div>
            <div>
                <Spinner v-if="spinner" />
            </div>
        </div>
    </div>
</template>

<style>
.input-field {
    border: 1px solid #D1D5DB;
    border-radius: 0.375rem;
    padding: 0.375rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #4B5563;
}
</style>
