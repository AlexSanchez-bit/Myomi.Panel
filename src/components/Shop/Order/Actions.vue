<template>
  <div>
    <Button icon="pi pi-eye" class="!bg-coreanblue !rounded-full" @click="isOpen=!isOpen" v-tooltip="$t('view_details')" /> 
    <Dialog v-model:visible="isOpen">
       <OrderCard :order="order" />
      </Dialog>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import {ref} from "vue"
import OrderCard from "./OrderCard.vue"
import { useOrderService  } from "@/composables/Order/useOrderService";
const service = useOrderService()
const isOpen= ref<boolean>(false)


const props = defineProps<{
    order:any
}>()
  
</script>
