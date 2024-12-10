<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import IconClose from '@/components/icons/IconClose.vue';
import usersApi from '@/stores/userApi';
import { decryptDatos } from '@/stores/hub';


/* data */
    const props = defineProps({
        close: { type: Function, default: ()=>{} },
        icoType: { type: String },
        title: { type: String },
        subTitle: { type: String },
        onClick: { type: Function },
        onCancel: { type: Function },
        butText: { type: String },
        sendTrees: { type: Function, default: ()=>{} },
        });

    const treeList = ref<treeList[]>();
    const treeType = ref<treeType[]>();
    const numTipoArbolesElegidos = ref<Number>();
    const numTotalArboles = ref<Number>();

/* interfaces */

interface treeList {
    id: number;
    name: string;
}

interface treeType {
    tree_type: number;
    tree_type_name?: string;
    quantity: number;
}

/* methods */

const getArbolitos = async () => {
    try {
        const response = await usersApi.get('/manager/tree-types/', {
            headers: {
                Authorization: `Bearer ${decryptDatos(localStorage.getItem('token') || '')}`
            },
        });
        treeList.value = response.data;
    } catch (error) {
        console.log(error);
    }
}

const isCheked = (name: string) => {
    const checkBox = document.getElementsByName(name);
    const otroInput = document.getElementById(name) as HTMLInputElement;
    for (let i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            otroInput?.removeAttribute('disabled');
        } else {
            if (otroInput) {
                otroInput.value = '';
            }
            otroInput?.setAttribute('disabled', 'true');
        }
    }
}

const arrayArboles = async () => {
    const checkBox = document.querySelectorAll('input[type="checkbox"]');
    checkBox.forEach((element, index) => {
        if (element.checked && (treeList.value ?? []).length > index) {
            treeType.value ??= [];
            treeType.value.push({
                tree_type: treeList.value?.[index]?.id ?? 0,
                quantity: document.getElementById(element.name)?.value ? parseInt(document.getElementById(element.name)?.value) : 0,
            });
        }
    });
    console.log(treeType.value);
    props.sendTrees(treeType.value)
    props.close()
}

/* limitar a 4 cifras el input numerico */
const handleInput = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length > 4) {
        event.target.value = inputValue.slice(0, 4); // Limit to 4 characters
    }
};

/* contar cuantos tipos de arbol se escogieron  */

const arbolesElegidos = computed(()=> {
    numTipoArbolesElegidos.value = treeType.tree_type.value.length;
    return numTipoArbolesElegidos.value;
}) 
const TotalArboles = computed(() => {
  // Calculate and store the total quantity of selected trees
    let totalQuantity = 0;

    for (let i = 0; i < treeType.quantity.value.length; i++) {
        totalQuantity += treeType.quantity.value[i];
    }

    numTotalArboles.value = totalQuantity; // Update the observable variable
  return totalQuantity; // Return the value for computed property usage
});



/* lifecicle */
onMounted(() => {
    getArbolitos();
});
</script>

<template>
    <div class="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center bg-[#89858533] p-4 z-50 ">
        <div class="p-4 pb-6 rounded-3xl min-w-[250px] max-w-[350px] h-[800px]" :class="`bg-white`">
            <div class="h-[750px] overflow-auto">
                <div class="p-2 w-full flex justify-end cursor-pointer" v-if="props.close">
                    <icon-close :width="'20px'" :height="'20px'" @click="props.close()" />
                </div>
                <h1 class="w-full text-center my-4 text-2xl" :class="`text-green-900`" v-if="props.title">
                    {{ props.title }}
                </h1>
                <p class="w-full text-center my-4 text-sm" :class="`text-green-900`" v-if="props.subTitle">
                    {{ props.subTitle }}
                </p>
                <div class="flex">
                    <div class="mx-4">
                        <div class="flex flex-col">
                            <div class="flex justify-between mb-2">
                                <p>Nombre</p>
                                <p>Cantidad</p>
                            </div>
                            <div class="flex flex-col" v-for="(tree, index) in treeList" :key="tree.id">
                                <div class="flex justify-between content-center" >
                                    <div class="flex justify-between content-cente py-1">
                                        <input class="mr-2" type="checkbox" :name="`tipoArbol${index}`" @change="isCheked(`tipoArbol${index}`)">
                                        <p>{{ tree.name }}</p>
                                    </div>
                                    <input class="outline-none border rounded-[35px] px-2 py-1 w-1/3 mb-1 text-center"  placeholder="0000" type="number" disabled :id="`tipoArbol${index}`" max="9999" :class="{ 'bg-green-100 rounded-3xl': index % 2 === 0 }" @input="handleInput"> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <button class="w-full mt-4" :class="`text-green-700`" v-if="props.onCancel" @click="arrayArboles()">Guardar</button>
                    <button class="w-full mt-4" :class="`text-green-700`" v-if="props.onClick" @click="props.close()">Cancelar</button>
                </div>
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
