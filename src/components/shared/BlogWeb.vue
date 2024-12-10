<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showToast, POSITION } from '../../stores/toast';
import ModCrearBlog from '@/components/shared/modales/ModCrearBlog.vue';
import ModBlogDetails from '@/components/shared/modales/ModBlogDetails.vue';
import usersApi from '@/stores/userApi';
import Spinner from '@/components/shared/Spinner.vue';
import ModEditarBlog from '@/components/shared/modales/ModEditarBlog.vue';

/* data */
const ModCreateBlog = ref<Boolean>(false);
const allBlogs = ref<any[]>([]); 
const abrirDetalleBlog = ref<Boolean>(false);
const blogId = ref<number>(0);
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
};

const openBlogDetail = (id: number) => {
    blogId.value = id;
    abrirDetalleBlog.value = true;
};

const getBlogs = async () => {
    try {
        spinner.value = true;
        const response = await usersApi.get('/manager/blogs/', {
        })
        allBlogs.value = response.data;
        spinner.value = false;
    } catch (error) {
        showToast('No se pudo ecuperar la información de los blogs', 'error', 3000, POSITION.BOTTOM_RIGHT)
        spinner.value = false;
    }
};

/* lifecycle */
onMounted( async () => {
    await getBlogs();
    
})


</script>

<template>
    <div class="bg-white">
        <div class="pb-10">
            <div class="cursor-pointer pr-1 h-screen overflow-auto" >
                <div class="w-full" >
                    <div class="bg-white h-[80px] flex justify-start items-center">
                        <img class="pl-20" src="@/assets/IconsSvg/IconLogoTreeoma.svg" alt="treeomaLogo">
                    </div>
                    <div v-for="firstBlog in allBlogs.slice(0, 1)">
                        <div class=" px-10 py-5 bg-gray-200">
                            <div class="flex justify-between">
                                <div class="w-2/3">
                                    <p class="text-lg font-semibold mb-1">{{ firstBlog.title }}</p>
                                    <p class="text-[14px] mb-4">Creado el {{ formatDate(firstBlog.created_at) }}</p>
                                    <p class="text-[14px]">{{ firstBlog.text.slice(0, 400) }} ...</p>
                                    <button class="bg-green-900 mt-7 px-6 py-2 rounded-3xl shadow-md text-white" @click="openBlogDetail(firstBlog.id)">Leer más</button>
                                </div>
                                <div class="w-1/3 flex justify-center items-center">
                                    <img class="max-w-[250px] h-[150px]" :src="firstBlog.image1" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-10">
                        <div class="border-b-2 mb-4">
                            <p class="px-5 pb-5 text-lg font-semibold">Todas las publicaciones</p>
                        </div>
                        <div v-for="blog in allBlogs.slice(1)" :key="blog.id">
                            <div class="flex justify-start items-start w-full py-10">
                                <div class="flex justify-center max-h-[450px] w-1/4 px-5">
                                    <img class="max-w-[250px] h-[150px] rounded-lg" :src="blog.image1" />
                                </div>
                                <div class=" ml-5 h-[75.79px] flex-col justify-between  pr-10 w-3/4" >
                                    <div class="self-stretch h-[37.79px] flex-col justify-start items-start">
                                        <div class="text-emerald-900 text-md font-semibold">{{ blog.title }}</div>
                                        <div class="text-green-700 text-[14px]">Creado el {{ formatDate(blog.created_at) }}</div>
                                    </div>
                                    <div class="pt-8">
                                        <div class="text-gray-700 text-[14px]">{{ blog.text.slice(0, 400) }} ...</div>
                                    </div>
                                    <div>
                                        <button class="text-green-900 text-[14px] cursor-pointer font-semibold" @click="openBlogDetail(blog.id)">Leer más</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <ModBlogDetails v-if="abrirDetalleBlog" :close="() => abrirDetalleBlog = false" :blogId="blogId" />
            </div>
            <div>
                <spinner v-if="spinner"/>
            </div>
        </div>
    </div>
</template>

