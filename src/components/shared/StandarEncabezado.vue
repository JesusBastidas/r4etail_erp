<script setup lang="ts">
import { ref } from 'vue';
import IconArrowForward from '@/components/icons/IconArrowForward.vue';

const props = defineProps({
    tittle:{
        type: String,
        required: true
    },
    otherText:{
        type: String,
        required: false
    },
    image:{
        type: Boolean,
        default: false,
    },
})
</script>

<template>
    <div class="w-full md:w-3/4 lg:w-4/5 h-[59px] px-[23px] py-8 bg-white rounded-[50px] justify-center items-center inline-flex">
        <div class="grow shrink basis-0 self-stretch justify-between items-center inline-flex">
            <div class="text-emerald-900 sm:text-sm md:text-sm lg:text-sm font-semibold tracking-[3.24px]">{{props.tittle}}</div>
            <div class="justify-start items-center gap-0.5 flex">
                <div class="w-[121px] text-emerald-600 text-xs font-medium cursor-pointer">{{ props.otherText }}</div>
                <div class="w-[18px] h-[18px] relative" v-if="props.image">
                    <div class="w-[18px] h-[18px] left-0 top-0 absolute bg-white cursor-pointer">
                        <icon-arrow-forward :width="'18px'" :height="'18px'" :fill="'#059669'" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>