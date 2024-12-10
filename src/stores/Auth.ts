import {ref} from 'vue';
import {defineStore} from 'pinia';
import crypto from 'crypto-js';



export const useLoginUsersStore = defineStore('loginUsers', () => {
    
    const email = ref<string>('');
    const password = ref<string>('');
    const error = ref<string>('')

    return {
        // state
        email,
        password,
        error,
        
        // getters

        // actions
        
    }
})

export const useDesincryptItemStore = defineStore('encryptedLoginUsers', () => {

    const localData = ref<string>(localStorage.getItem('token') || '')
    const encryptData = ref<string>(crypto.AES.decrypt(localData.value, import.meta.env.VITE_KEY_APP).toString(crypto.enc.Utf8))

    return {
        encryptData
    }
})
