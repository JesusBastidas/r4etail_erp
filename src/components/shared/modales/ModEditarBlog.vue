<script setup lang="ts">
import { onMounted, ref } from 'vue';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import { decryptDatos } from '@/stores/hub';
import  { showToast, POSITION } from '@/stores/toast';
import StandarAddDocuments from '@/components/shared/StandarAddDocuments.vue';

/* data */

const blogTittle = ref<String>('');
const blogText = ref<String>('');
const image1 = ref<File | null>(null);
const image2 = ref<File | null>(null);
const image3 = ref<File | null>(null);

const props = defineProps({
    close: { type: Function },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    butText: { type: String },
    onCancel: { type: Function },
    blogId: { type: Number },
    });

/* interfaces */

interface BlogPost {
    title: string;
    text: string;
    image1: string;
    image2: string;
    image3: string;
}

/* methods */

const getBlog = async () => {
    try {
        const res = await usersApi.get(`/manager/blogs/${props.blogId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        });
        blogTittle.value = res.data.title;
        blogText.value = res.data.text;
    } catch (error: any) {
        const errorMessage = error.response?.data?.text;
        if (errorMessage) {
        showToast(errorMessage, 'error', 3000, POSITION.BOTTOM_RIGHT);
        } else {
        showToast('Error cargando el blog.', 'error', 3000, POSITION.BOTTOM_RIGHT);
        }
    }
}

const editBlog = async () => {
    try {
        const formData = new FormData();
        formData.append('title', blogTittle.value.toString());
        formData.append('text', blogText.value.toString());
        if (image1.value) {
            formData.append('image1', image1.value);
        }
        if (image2.value) {
            formData.append('image2', image2.value);
        }
        if (image3.value) {
            formData.append('image3', image3.value);
        }
        await usersApi.patch(`/manager/blogs/${props.blogId}/`, formData, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        showToast('Blog modificado', 'success', 3000, POSITION.BOTTOM_RIGHT)
        props.close();
    } catch (error: any) {
        const errorMessage = error.response?.data?.text;
        if (errorMessage) {
        showToast(errorMessage, 'error', 3000, POSITION.BOTTOM_RIGHT);
        } else {
        showToast('Error modificando el blog.', 'error', 3000, POSITION.BOTTOM_RIGHT);
        }
    }
}

/* onMounted */

onMounted( async () => {
    if (localStorage.getItem('token')) {
        await getBlog();
    }
})

</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#16161633] p-4">
        <div class="p-4 pb-6 rounded-3xl min-w-[900px] min-h-[600px]" :class="`bg-white`">
            <div class="flex">
                <h1 class="w-full text-start mb-2 mt-2 text-lg font-semibold" :class="`text-green-600`" v-if="props.title">
                    {{ props.title }}
                </h1>
                <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
            </div>
            <p class="w-full text-start my-2 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                {{ props.subTitle }}
            </p>
            <div class="w-full">
                <div class="w-full">
                    <div class="mb-2">
                        <p class="mb-2 text-green-800">Título</p>
                        <input class="outline-none border rounded-[35px] px-2 py-1 w-full" type="text" v-model="blogTittle">
                    </div>
                    <div class="flex justify-between">
                        <div class="mb-2 w-[200px]">
                            <p class="mb-2 text-green-800">Imagen</p>
                            <standar-add-documents @file-list="(files: File[])=> image1=files[0]"/>
                        </div>
                        <div class="mb-2 w-[200px]">
                            <p class="mb-2 text-green-800">Imagen</p>
                            <standar-add-documents @file-list="(files: File[])=> image2=files[0]"/>
                        </div>
                        <div class="mb-2 w-[200px]">
                            <p class="mb-2 text-green-800">Imagen</p>
                            <standar-add-documents @file-list="(files: File[])=> image3=files[0]"/>
                        </div>
                    </div>
                    <div class="mb-2">
                        <p class="mb-2 text-green-800">Contenido</p>
                        <textarea class="outline-none border rounded-[35px] p-4 w-full" name="" id="" cols="30" rows="10" v-model="blogText"></textarea>
                    </div>
                </div>
            </div>
            <div class="flex justify-center">
                <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" @click="editBlog">{{props.butText}}</button>
                <button class="px-4 mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="props.onCancel()">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

</style>
