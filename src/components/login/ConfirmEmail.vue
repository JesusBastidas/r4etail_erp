<script setup lang='ts'>
    import { useRouter, useRoute } from 'vue-router';
    import { ref } from 'vue';
    import usersApi from '@/stores/userApi';
    import  { showToast, POSITION } from '@/stores/toast';
    import IconTreeomaLogo from '@/components/icons/IconTreeomaLogo.vue';
    /* import Spinner from '@/components/admin/generalComponets/Spinner.vue'; */ /* buscar un componente de spiner  */

    /* data */
    const router = useRouter()
    /* const route = useRoute() */
    const spinner = ref<Boolean>(false)
    const emailConfirmation = ref<string>('')

    /* store */
    
    /* methods */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
        spinner.value = true
        console.log(emailConfirmation.value)
        if(!emailRegex.test(emailConfirmation.value)) {
            showToast('Ingrese un correo electrónico válido', 'error', 3000, POSITION.BOTTOM_LEFT)
            spinner.value = false
            return
        }
        try {
            const res = await usersApi.post('/users/recovery_password/reset/', {
                email: emailConfirmation.value,
            });
            router.push('/verify') 
            console.log(res)
        }catch (err: any){
            showToast(err.message, 'error', 3000, POSITION.BOTTOM_LEFT)
        }
    }
</script>

<template>
    <div class="w-screen h-screen">
        <div class="w-screen h-screen flex flex-col justify-center items-center">
            <div class="flex flex-col">
                <div>
                    <icon-treeoma-logo :height="'60'"  :width="'280'" />
                </div>
                <div class="flex flex-col">
                    <p>Escribe tu correo electrónico para reestablecer tu contraseña.</p>
                </div>
                <div class="my-4">
                    <label class="text-green-900 font-medium text-xl m-2">Correo electrónico</label><br>
                    <div>
                        <input class="mt-3 border border-green-700 rounded-[35px] p-2 px-10 ml-3 focus:border-green-700 outline-none focus:ring-1 focus:ring-green-700" type="email" placeholder="Correo electrónico" v-model="emailConfirmation"  @keydown.enter="handleLogin()">
                    </div>
                </div>
                <div class="flex justify-center">
                    <button class="font-medium ml-2 mb-3 mt-6 border border-green-700 rounded-[35px] w-[300px] py-2 bg-green-900 text-white cursor-pointer"  @click="handleLogin()">REESTABLECER CONTRASEÑA</button>
                </div>
            </div>
        </div>
    </div>
</template>
