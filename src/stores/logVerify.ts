import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';


export const useAuthStore = defineStore ('auth', () => {
    const router = useRouter();
    const token = ref(localStorage.getItem('token'));
    const isLogged = computed(() => !!token.value);  /* el operado !! convierte el valor en un booleano y verifica que la variable sea verdadero y no nula (not null)*/

    function logout(){
        token.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('user_id')
        localStorage.removeItem('isLoggedIn');
        router.replace({ path: '/' }).then(() => {
            window.location.reload();
        });
    }

    function userVerify(){
        if (!isLogged.value){
            router.replace('/')
        }
    }

    return { token, isLogged, logout, userVerify}
    }
)



