<script setup lang="ts">
import { ref, computed } from 'vue';
import ModalEventDetail from '@/components/shared/modales/ModalEventDetail.vue';
import usersApi from '@/stores/userApi';
import { decryptDatos } from '@/stores/hub';
import { showToast, POSITION } from '../../stores/toast';
import Spinner from '@/components/shared/Spinner.vue';


/* data */

const showModal = ref<Boolean>(false);
const selectedEvent = ref<Object>({});
const spinner = ref<Boolean>(false);

const props = defineProps({
    events: {
        type: Array,
        default: []
    }
})

/* methods */

const handleEventClick = (event: any) => {
    selectedEvent.value = event;
    showModal.value = true;
};

const parseEventDay = (eventDay: string) => {
    const [year, month, day] = eventDay.split('-');
    return `${year}/${month}/${day}`;
};

const deleteEvent = async () => {
    console.log(selectedEvent.value.id);
    spinner.value = true;
    try {
        const response = usersApi.delete(`/operations/event/${selectedEvent.value.id}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
            showToast('Evento eliminado correctamente', 'success', 3000, POSITION.BOTTOM_RIGHT)
            showModal.value = false;
            spinner.value = false;
            setTimeout(() => {
                location.reload();
            }, 1000);
    } catch (error) {
        spinner.value = false;
        showToast('Ha habido un problema al tratar de eliminar el evento', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
};

const generateAtributes = () => [
    // Attributes for todos
    ...props.events.map((event:any) => ({
        dates: [new Date(parseEventDay(event.event_day))],
        /* dates: event.event_day, */
        bar: 'green',
        popover: true,
        customData: event
    })),
    {
        highlight: {
            color: 'green',
            fillMode: 'light',
        },
        dates: [new Date()],
    }
];


const attributes = computed(() => generateAtributes());
</script>

<template>
    <v-calendar class="custom-calendar" is-expanded @dayclick="" locale="es" :attributes="attributes">
        <template #day-popover="{ attributes }">
            <ul>
                <li class="custom-event" v-for="{ key, customData } in attributes" :key="key"
                    @click="handleEventClick(customData)">
                    {{ customData.title }}
                </li>
            </ul>
        </template>
    </v-calendar>
    <div>
        <ModalEventDetail :showModal="showModal" :selectedEvent="selectedEvent" @close="showModal = false" :deleteEvent="deleteEvent" />
    </div>
    <div>
        <Spinner v-if="spinner" />
    </div>
</template>

<style>
.custom-calendar.vc-container {
    /* Ajustar el tamaño del contenedor para que se ajuste a su contenido */
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    --day-width: 76px;
    --day-height: 70px;
    --dark-green: #2c6e49; 
    --light-green: #f3fcf5;
    --second-green: #149474;

}

/* .day {
    width: var(--day-width);
    height: var(--day-height);
    min-width: var(--day-width);
    min-height: var(--day-height);
} */
.vc-header {
    padding: 0 0 50px 0;
}

.vc-header .vc-prev {
    width: 40px;
    height: 40px;
    margin-left: 10px;
    background-color: var(--second-green);
    color: white;
}

.vc-header .vc-next {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    background-color: var(--second-green);
    color: white;
}

.vc-title-wrapper .vc-title {
    background-color: #149474;
    padding: 5px 20px;
    color: white;
}

.vc-weekday {
    background-color: var(--second-green);
    padding: 10px 0;
    color: white;
    font-weight: normal;
    /* Letras en blanco */
}

.vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    /* height: var(--day-height);
    min-width: var(--day-width); */
    background-color: white;
    color: #000;
    /* Letras en negro */
}


.weekday-1,
.weekday-7 {
    background-color: var(--light-green);
}

.custom-event {
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.custom-event:hover {
    background-color: rgb(17, 68, 17);
    color: white;
}
</style>