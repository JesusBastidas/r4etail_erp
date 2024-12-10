<script setup lang='ts'>
    import { useRouter, useRoute } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import { useDesincryptItemStore } from '@/stores/Auth';
    import { useLoginUsersStore } from '@/stores/Auth'
    import { storeToRefs } from 'pinia';
    import { showToast, POSITION } from '@/stores/toast';
    import { decryptDatos, encryptDatos  } from '@/stores/hub';
    import usersApi from '@/stores/userApi';
    import IconTreeomaLogo from '@/components/icons/IconTreeomaLogo.vue';
    import Spinner from '@/components/shared/Spinner.vue'; 

    /* data */
    const router = useRouter()
    /* const route = useRoute() */
    const spinner = ref(false)

    /* store */
    const loginStore = useLoginUsersStore()
    const token = useDesincryptItemStore();
    const { encryptData } = storeToRefs(token);
    const { email, password } = storeToRefs(loginStore)
    
    /* methods */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
        spinner.value = true
        /* verifico si ya hay una sesión iniciada en otra ventana */
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            const storedEmail = localStorage.getItem('email');
            const storedPassword = localStorage.getItem('password');
            if (storedEmail) {
                email.value = decryptDatos(storedEmail);
            }
            if (storedPassword) {
                password.value = decryptDatos(storedPassword);
            }
            await loginStoredCredentials();
            spinner.value = false
            /* showToast('Ya se ha iniciado sesión en otra ventana. Cierre la sesión allí para continuar.', 'error', 3000, POSITION.BOTTOM_LEFT); */
            return;
        }

        try {
            const response = await usersApi.post('/users/login/', {
                email: email.value,
                password: password.value,
            });
            localStorage.setItem('token', encryptDatos(response.data.access));
            localStorage.setItem('userType', encryptDatos(response.data.user_type));
            localStorage.setItem('user_id', response.data.user_id)
            localStorage.setItem('isLoggedIn', 'true');
            await verifyRole(response.data.user_type);
            spinner.value = false
        }catch (err: any){
            console.log(err)
            showToast(err.response.data.detail, 'error', 3000, POSITION.BOTTOM_LEFT)
            spinner.value = false
        }
    }

    const loginStoredCredentials = async () => {
        spinner.value = true
        /* verifico si el usuario ha llenado todos los campos */
        if(!email.value || !password.value) {
            showToast('Por favor, complete todos los campos', 'error', 3000, POSITION.BOTTOM_LEFT)
            spinner.value = false
            return
        }

        /* verifico si el email es válido */
        if(!emailRegex.test(email.value)) {
            showToast('Ingrese un correo electrónico válido', 'error', 3000, POSITION.BOTTOM_LEFT)
            spinner.value = false
            return
        }

        /* si todo esta bien, hago la petición */
        try {
            const response = await usersApi.post('/users/login/', {
                email: email.value,
                password: password.value,
            });
            localStorage.setItem('token', encryptDatos(response.data.access));
            localStorage.setItem('userType', encryptDatos(response.data.user_type));
            localStorage.setItem('user_id', response.data.user_id)
            localStorage.setItem('isLoggedIn', 'true');
            await verifyRole(response.data.user_type);
            spinner.value = false
        }catch (err: any){
            console.log(err)
            showToast(err.response.data.detail, 'error', 3000, POSITION.BOTTOM_LEFT)
            spinner.value = false
        }
    }

    const verifyRole = async (data: string) => {
        try { 
            if(data == 'admin' || data == 'director_of_operations') {
                router.replace('/admin')
            } else if(data == 'client_bosque_propio' || data == 'client_bosque_compartido'){
                router.replace('/clients')
            } else {
                showToast('No tienes permisos para acceder a esta página', 'error', 3000, POSITION.BOTTOM_LEFT)
                }    
        }catch (err: any) {
            showToast(err.message, 'error', 3000, POSITION.BOTTOM_LEFT)
            }
        }

    /* mounted */

    onMounted (() => {
        if(localStorage.getItem('token') && localStorage.getItem('user_type')) {
            router.replace('/admin')
        }
    })
        
</script>

<template>
    <div class="w-screen h-screen bg-white">
        <div class="w-screen h-screen flex flex-col justify-center items-center">
            <div class="flex flex-col">
                <div>
                    <icon-treeoma-logo :height="'60'"  :width="'280'" />
                </div>
                <div class="flex flex-col">
                    <label class="text-green-900 font-medium text-xl m-2 mb-3">Nombre de Usuario</label>
                    <div>
                        <input class="mt-3 border border-green-700 rounded-[35px] p-2 px-10 ml-3 focus:border-green-700 outline-none focus:ring-1 focus:ring-green-700" type="email" placeholder="Usuario" v-model="email">
                    </div>
                </div>
                <div class="my-4">
                    <label class="text-green-900 font-medium text-xl m-2">Contraseña</label><br>
                    <div>
                        <input class="mt-3 border border-green-700 rounded-[35px] p-2 px-10 ml-3 focus:border-green-700 outline-none focus:ring-1 focus:ring-green-700" type="password" placeholder="Contraseña" v-model="password" @keydown.enter="handleLogin()">
                    </div>
                </div>
                <div class="flex justify-center">
                    <button class="font-medium ml-2 mb-3 mt-6 border border-green-700 rounded-[35px] px-20 py-2 bg-green-900 text-white cursor-pointer"  @click="handleLogin()">INICIAR SESIÓN</button>
                </div>
                <div class="flex justify-center">
                    <p class="text-green-900 cursor-pointer"  @click="router.push('/confirmation')">¿Olvidaste tu contraseña?</p>
                </div>
            </div>
        </div>
    </div>
    <spinner v-if="spinner" /> 
</template>

<style scoped>



</style>