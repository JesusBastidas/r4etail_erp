<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/logVerify';
import { decryptDatos } from '@/stores/hub';

/* data */
const storedUserType = ref<String>('');
const authStore = useAuthStore();

const userType = () => {
    storedUserType.value = decryptDatos(localStorage.getItem('userType') || '') ;
if (storedUserType.value !== null && storedUserType.value !== '') {
    return storedUserType;
}
return 'unknown';
}

const emit = defineEmits(['close']);
const props = defineProps({
    selectedEvent: { type: Object, required: true },
    showModal: { type: Boolean, required: true },
    deleteEvent: { type: Function, required: true }
});

const closeModal = () => {
    emit('close');
};

/* lifecycle */
onMounted(async () => {
    authStore.userVerify();
    if (localStorage.getItem('token')) {
        await userType();
    }
});
</script>
<template>
    <div v-if="showModal" class="modal-overlay fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-content bg-white rounded-lg shadow-lg p-6 min-w-[400px]">
            <h2 class="text-xl font-medium mb-4 text-green-800">Detalles del evento</h2>
            <div class="mb-4 flex">
                <p class="text-green-700 font-medium w-1/4">Título:</p>
                <p class="text-gray-700 w-3/4 font-medium">{{ props.selectedEvent.title }}</p>
            </div>
            <div class="mb-4 flex">
                <p class="text-green-700 font-medium w-1/4">Predio:</p>
                <p class="text-gray-700 w-3/4 font-medium">{{ props.selectedEvent.location }}</p>
            </div>
            <div class="mb-4 flex">
                <p class="text-green-700 font-medium w-1/4">Árboles:</p>
                <p class="text-gray-700 w-3/4 font-medium">{{ props.selectedEvent.trees_planted }}</p>
            </div>
            <div class="mb-4 flex">
                <p class="text-green-700 font-medium w-1/4">Tipo:</p>
                <p class="text-gray-700 w-3/4 font-medium">{{ props.selectedEvent.event_type }}</p>
            </div>
            <div class="mb-4 flex">
                <p class="text-green-700 font-medium w-1/4">Fecha:</p>
                <p class="text-gray-700 w-3/4 font-medium">{{ props.selectedEvent.event_day }}</p>
            </div>
            <div class="mb-4 flex">
                <p class="text-green-700 font-medium w-1/4">Invitado:</p>
                <div class="text-gray-700 w-3/4 flex flex-wrap flex-col">
                    <span v-for="guest in selectedEvent.current_attendees" :key="guest" class="mr-2 font-medium">{{ guest.client_info.email }}</span>
                </div>
            </div>
            <div class="mt-6 flex justify-between">
                <button class="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
                    @click="closeModal">
                    Aceptar
                </button>
                <button v-if="storedUserType === 'admin'" class="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
                    @click="props.deleteEvent">
                    Eliminar evento
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>