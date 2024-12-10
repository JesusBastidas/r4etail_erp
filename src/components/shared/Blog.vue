<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { decryptDatos } from '@/stores/hub';
import { useAuthStore } from '@/stores/logVerify';
import { showToast, POSITION } from '../../stores/toast';
import ModCrearBlog from '@/components/shared/modales/ModCrearBlog.vue';
import ModBlogDetails from '@/components/shared/modales/ModBlogDetails.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';
import ModEditarBlog from '@/components/shared/modales/ModEditarBlog.vue';

/* data */
const ModCreateBlog = ref<Boolean>(false);
const authStore = useAuthStore();
const allBlogs = ref<any[]>([]); 
const abrirDetalleBlog = ref<Boolean>(false);
const blogId = ref<number>(0);
const storedUserType = ref<String>('');
const spinner = ref<Boolean>(false);
const blogEditMod = ref<Boolean>(false);

/* methods */

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString();
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

const openBlogDetail = (id: number) => {
    blogId.value = id;
    abrirDetalleBlog.value = true;
}

const openBlogEdit = () => {
    abrirDetalleBlog.value = false;
    blogEditMod.value = true;
}

const userType = () => {
        storedUserType.value = decryptDatos(localStorage.getItem('userType') || '') ;
    if (storedUserType.value !== null && storedUserType.value !== '') {
        return storedUserType;
    }
    return 'unknown';
}

const eliminarBlog = async () => {
    await getBlogs();
    setTimeout(() => {
        abrirDetalleBlog.value = false;
    }, 1000);
}

const getBlogs = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get('/manager/blogs/', {
            /* headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            } */
        })
        allBlogs.value = response.data;
        spinner.value = false;
    } catch (error) {
        showToast('No se pudo ecuperar la información de los blogs', 'error', 3000, POSITION.BOTTOM_RIGHT)
        spinner.value = false;
    }
}

/* lifecycle */
onMounted( async () => {
    /* authStore.userVerify(); */
    await getBlogs();
    await userType();
    
})


</script>

<template>
    <div class="mx-[50px]">
        <div class="pb-10">
            <div class="bg-green-700 rounded-2xl p-4 mt-4 flex justify-between">
                <p class="text-white font-semibold text-xl">Todas las publicaciones</p>
                <button class="bg-white rounded-xl py-1 px-4 text-green-700 shadow font-semibold text-lg" v-if="storedUserType === 'admin' || storedUserType ==='director_of_operations'" @click="ModCreateBlog = true">Crear blog</button>
            </div>
            <div class="cursor-pointer pr-1 h-screen overflow-auto" >
                <div v-for="blog in allBlogs" :key="blog.id">
                    <div class="p-[15px] w-full bg-white rounded-t-3xl rounded-bl-3xl justify-start items-start inline-flex mt-5 mr-5" @click="openBlogDetail(blog.id)"> 
                        <div class="flex justify-start items-start w-full">
                            <div class="flex justify-center max-h-[450px] w-1/4">
                                <img class="max-w-[250px] h-[150px] rounded-lg" :src="blog.image1" />
                            </div>
                            <div class="h-[75.79px] flex-col justify-between  pr-10 w-3/4" >
                                <div class="self-stretch h-[37.79px] flex-col justify-start items-start">
                                    <div class="text-emerald-900 text-md font-semibold">{{ blog.title }}</div>
                                    <div class="text-green-700 text-[14px]">Creado el {{ formatDate(blog.created_at) }}</div>
                                </div>
                                <div class="py-8">
                                    <div class="text-emerald-900 text-[12px]">{{ blog.text.slice(0, 400) }} ...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <ModCrearBlog v-if="ModCreateBlog" :close="() => ModCreateBlog = false" title="Creación de Blog" butText="Guardar" :onClick="() => ModCreateBlog = false" :onCancel="() => ModCreateBlog = false"/>
            </div>
            <div>
                <ModBlogDetails v-if="abrirDetalleBlog" butText="Editar blog" :close="() => abrirDetalleBlog = false" :blogId="blogId" :onCancel="eliminarBlog" :onClick="openBlogEdit"/>
            </div>
            <div>
                <mod-editar-blog v-if="blogEditMod" :blogId="blogId" :close="()=> blogEditMod = false" butText="Guardar cambios" :onCancel="()=> blogEditMod = false"  />
            </div>
            <div>
                <spinner v-if="spinner"/>
            </div>
        </div>
    </div>
</template>

