/* import './assets/main.css' */
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';


import App from './App.vue'
import router from './router'


const app = createApp(App)

const options = {
    // You can set your default options here
};

app.use(createPinia())
app.use(router)
app.use(Toast, options);
app.use(VCalendar, {})

app.component('calendar', Calendar);
app.component('date-picker', DatePicker);

app.mount('#app')
