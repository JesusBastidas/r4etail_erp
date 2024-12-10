<script setup lang="ts">
import { ref } from "vue";

/* data */

/* methods */




</script>

<template>
    <div class="mx-[50px] mt-[50px] flex justify-center content-center">
        <div class="pl-12 pr-[31px] py-[41px] bg-white rounded-[20px] ">
            <div class="self-stretch flex-col justify-start items-start gap-[30px] inline-flex">
                <div class="flex-col justify-start items-start gap-[15px] flex">
                    <div class="text-emerald-900 text-xl font-medium font-['General Sans Variable']">Contáctate con nuestro soporte a través de:</div>
                    <div class="text-emerald-900 text-base font-light font-['General Sans Variable']">Puedes contactarnos a través de nuestro correo electrónico <span class="font-semibold">contact@treeoma.com</span>, o si lo prefieres a través de nuestro WhatsApp <span class="font-semibold">+57 315 6203642</span>, el cual encontrarás más abajo. Recuerda que el tiempo de respuesta puede variar dependiendo del canal y la cantidad se solicitudes que tengamos en el momento.</div>
                </div>
                <div class="justify-start items-start gap-[34px] inline-flex">
                    <!-- <div class="py-2 px-3 bg-emerald-900 rounded-[35px] justify-center items-center gap-2.5 flex cursor-pointer">
                        <a href="mailto:contact@treeoma.com" target="_blank" class="text-white text-base font-normal tracking-[2.88px] cursor-pointer">
                            Email
                        </a>
                    </div> -->
                    <div class="py-2 px-3 bg-emerald-900 rounded-[35px] justify-center items-center gap-2.5 flex cursor-pointer">
                        <a href="https://wa.me/573156203642" target="_blank" class="text-white text-base font-normal tracking-[2.88px] cursor-pointer">
                            Whatsapp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>