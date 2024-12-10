<script setup lang="ts">
import { ref } from 'vue';
import  { showToast, POSITION } from '../../stores/toast';

/* data */

const emit = defineEmits(['fileList']);
const fileList = ref<File[]>([]);

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false
    }
});

/* methos */

const handleFile = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const allowedSize = 1024 * 1024 * 5; // 5MB

    fileList.value = [];
    for (let i = 0; i < files.length; i++) {
        if (allowedTypes.includes(files[i].type)) {
            if (files[i].size < allowedSize) {
                /* console.log(files[i]); */
                fileList.value.push(files[i]);
            } else {
                showToast('El archivo es muy grande', 'warning', 3000, POSITION.BOTTOM_RIGHT)
            }
        } else {
            showToast('El archivo no es una imagen o un pdf', 'warning', 3000, POSITION.BOTTOM_RIGHT)
        }
    }
    emit('fileList', fileList.value);
}

</script>

<template>
    <div class="border rounded-[35px] flex justify-end items-end">
        <img v-if="fileList.length==0" src="@/assets/IconsSvg/IconUpload.svg" alt="" class="z-50 px-2 py-1" />
        <img v-else src="@/assets/IconsSvg/IconCheck.svg" alt="Archivo cargado" class="z-50 px-2 py-1" />
        <input type="file" :multiple="props.multiple" @change="handleFile" class="opacity-0 z-10 absolute max-w-[210px] min-w-[150px]">
    </div>
</template>

<style scoped>
</style>