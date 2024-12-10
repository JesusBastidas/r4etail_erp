<script setup lang='ts'>
    import { useRouter, useRoute } from 'vue-router';
    import { ref } from 'vue';
    import usersApi from '@/stores/userApi';
    import IconTreeomaLogo from '@/components/icons/IconTreeomaLogo.vue';
    import  { showToast, POSITION } from '@/stores/toast';
    /* import Spinner from '@/components/admin/generalComponets/Spinner.vue'; */ /* buscar un componente de spiner  */

    /* data */
    const router = useRouter()
    /* const route = useRoute() */
    const spinner = ref<Boolean>(false)
    const verifyCode = ref<Number>()
    const newPassword = ref<string>()
    const newPass = ref<string>()
    const viewPassword = ref<boolean>(false);
    const viewPassword2 = ref<boolean>(false);

    /* store */
    
    /* methods */

    const handleLogin = async () => {
        if(newPass.value !== newPassword.value) {
            showToast('Las contraseñas no coinciden', 'error', 3000, POSITION.BOTTOM_LEFT)
            return
        } else {
            try {
            const res = await usersApi.post('/users/change_password/', {
                code: verifyCode.value,
                new_password: newPassword.value,
            });
            showToast('Contraseña cambiada con exito', 'success', 3000, POSITION.BOTTOM_LEFT)
            console.log(res)
            router.push('/login')
        } catch (error: any) {
            console.log(error)
            showToast(error.request.responseText, 'error', 3000, POSITION.BOTTOM_LEFT)
        }
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
                    <p class="w-[300px]">Para cambiar tu contraseña primero verifica tu cuenta con el código enviado al correo</p>
                </div>
                <div class="my-4">
                    <label class="text-green-900 font-medium text-xl m-2">Código</label><br>
                    <div>
                        <input class="mt-3 border border-green-700 rounded-[35px] p-2 px-10 ml-3 focus:border-green-700 outline-none focus:ring-1 focus:ring-green-700" type="string" placeholder="Ingresa el código" v-model="verifyCode"  @keydown.enter="handleLogin()">
                    </div>
                </div>
                <div class="flex flex-col">
                    <p>Ingresa una nueva contraseña.</p>
                    <label class="text-green-900 font-medium text-xl m-2 mb-3">Nueva contraseña</label>
                    <div class="flex flex-col">
                        <input class="mt-3 border border-green-700 rounded-[35px] p-2 px-10 ml-3 focus:border-green-700 outline-none focus:ring-1 focus:ring-green-700" v-model="newPass" :type="viewPassword ? 'text' : 'password'" placeholder="Contraseña" id="newPass">
                        <div class="ml-4">
                            <input class="mt-4 mr-4" type="checkbox" @change="viewPassword = !viewPassword">
                            <label class="text-green-900">Mostrar contraseña</label>
                        </div>
                    </div>
                </div>
                <div class="my-4">
                    <label class="text-green-900 font-medium text-xl m-2">Repite la contraseña</label><br>
                    <div class="flex flex-col">
                        <input class="mt-3 border border-green-700 rounded-[35px] p-2 px-10 ml-3 focus:border-green-700 outline-none focus:ring-1 focus:ring-green-700" v-model="newPassword" :type="viewPassword2 ? 'text' : 'password'" placeholder="Contraseña" id="newPassword"  @keydown.enter="handleLogin()">
                        <div class="ml-4">
                            <input class="mt-4 mr-4" type="checkbox" @click="viewPassword2 = !viewPassword2">
                            <label class="text-green-900">Mostrar contraseña</label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center">
                    <button class="font-medium ml-2 mb-3 mt-6 border border-green-700 rounded-[35px] w-[300px] py-2 bg-green-900 text-white cursor-pointer"  @click="handleLogin()">CAMBIAR CONTRASEÑA</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

input[type="number"]::-webkit-inner-spin-button, 
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0; 
}

</style>