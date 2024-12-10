<script setup lang="ts">

import { ref } from 'vue';

const email = ref<String>('');
const emails = ref<Array<string>>([]);
const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
const emailError = ref<Boolean>(false);

const addEmail = () => {
if (emailRegex.test(email.value)) {
    emails.value.push(email.value);
    email.value = '';
    emailError.value = false;
} else {
    emailError.value = true;
}
};

const removeEmail = (index) => {
emails.value.splice(index, 1);
};


</script>
<template>
<div class="p-2 max-h-40 overflow-y-auto">
    <div class="flex-shrink-0">
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="email" type="email" placeholder="Agregar correo electrónico" @keyup.enter="addEmail" />
        <div v-if="emailError" class="text-red-500 mt-2">
            Por favor, ingrese un correo electrónico válido.
        </div>
        <div class="p-2">
            <span v-for="(email, index) in emails" :key="index"
                class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
                {{ email }}
                <button @click="removeEmail(index)">X</button>
            </span>
        </div>
    </div>
</div>
</template>

