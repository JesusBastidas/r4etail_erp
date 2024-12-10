<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { POSITION, showToast } from '@/stores/toast';
import { decryptDatos } from '@/stores/hub';
import IconClose from '@/components/icons/IconClose.vue';
import Spinner from '@/components/shared/Spinner.vue';
import usersApi from '@/stores/userApi';


/* data */
const blogData = ref<BlogPost>();
const spinner = ref<Boolean>(false);
const storedUserType = ref<String>('');


const props = defineProps({
    close: { type: Function },
    icoType: { type: String },
    title: { type: String },
    subTitle: { type: String },
    onClick: { type: Function },
    onCancel: { type: Function },
    butText: { type: String },
    blogId: { type: Number }
    });

    /* interface */
interface BlogPost {
    id: number;
    title: string;
    text: string;
    image1: string;
    image2: string;
    image3: string;
    created_at: string;
    updated_at: string;
}

/* methods */

const userType = () => {
        storedUserType.value = decryptDatos(localStorage.getItem('userType') || '') ;
    if (storedUserType.value !== null && storedUserType.value !== '') {
        return storedUserType;
    }
    return 'unknown';
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString();
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

const getBlogs = async () => {
    try {
        
        spinner.value = true;
        const response = await usersApi.get('/manager/blogs/', {
            /* headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            } */
        })
        spinner.value = false;
        blogData.value = response.data.filter((blog: BlogPost) => blog.id === props.blogId);
    } catch (error) {
        console.log(error)
        showToast('Algo salio mal', 'success', 3000, POSITION.BOTTOM_RIGHT)
    }
};

const deleteBlog = async () => {
    try {
        spinner.value = true;
        await usersApi.delete(`/manager/blogs/${props.blogId}/`, {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            }
        })
        spinner.value = false;
        showToast('Blog eliminado', 'success', 3000, POSITION.BOTTOM_RIGHT)
        props.onCancel();
    } catch (error) {
        spinner.value = false;
        showToast('No se pudo eliminar el blog', 'error', 3000, POSITION.BOTTOM_RIGHT)
    }
};

function splitTextIntoFourParts(text) {
    const words = text.split(' ');
    const totalWords = words.length;
    const partSize = Math.ceil(totalWords / 4);

    const parts = [];

    for (let i = 0; i < totalWords; i += partSize) {
        parts.push(words.slice(i, i + partSize).join(' '));
    }

    // Asegurar que haya exactamente 4 partes
    while (parts.length < 4) {
        parts.push('');
    }

    return parts;
}

/* lifecycle */
onMounted( async () => {
    if (localStorage.getItem('userType')){
        await userType();
    }
    await getBlogs();
})


</script>

<template>
    <div class="">
        <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#89858533] p-4">
            <div class="p-4 pb-6 rounded-3xl h-[700px] min-w-[800px] max-w-[900px]" :class="`bg-white`">
                <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
                <div class="overflow-auto max-h-[600px]">
                    <div v-for="blog in blogData">
                        <div class="text-lg font-semibold text-green-700">{{ blog.title }}</div>
                        <div class="text-green-700 py-2">Creado el {{ formatDate(blog.created_at) }}</div>
                        <div class="pb-2 flex justify-center items-center">
                            <img class="" :src="blog.image1">
                        </div>
                        <div class="py-2">
                            {{ splitTextIntoFourParts(blog.text)[0] }}
                            
                        </div>
                        <div class="pb-2 flex justify-center items-center">
                            <img class="" :src="blog.image2">
                        </div>
                        <div class="py-2">
                            {{ splitTextIntoFourParts(blog.text)[1] }} {{ splitTextIntoFourParts(blog.text)[2] }}
                        </div>
                        <div class="pb-2 flex justify-center items-center">
                            <img class="max-w-[400px] max-h-[300px]" :src="blog.image3">
                        </div>
                        <div class="">
                            {{ splitTextIntoFourParts(blog.text)[3] }}
                        </div>
                    </div>
                </div>
                <div class="flex justify-between" v-if="storedUserType === 'admin' || storedUserType ==='director_of_operations'">
                    <button class="px-4 mt-4 bg-green-800 pb-1 rounded-[35px] text-white" v-if="props.onClick" @click="props.onClick">{{props.butText}}</button>
                    <button class="px-4 mt-4 border rounded-[35px] shadow-md" :class="`text-green-700`" v-if="props.onCancel" @click="deleteBlog()">Eliminar Blog</button>
                </div>
            </div>
        </div>
        <div>
            <spinner v-if="spinner" />
        </div>
    </div>
</template>