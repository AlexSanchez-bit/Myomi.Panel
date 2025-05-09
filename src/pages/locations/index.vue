<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";
import Button from "primevue/button";
import { useLocationService } from "@/composables/Location/useLocationService";
import { useCurrencyService } from "@/composables/Currency/useCurrencyService";
import type {ICurrency} from "@/services/Currency/Currency.service"
import { ref,onMounted } from "vue";
import {Pagination} from "@/utils/entities/Pagination"
import { FilterMatchMode } from "primevue/api";
const currencyService = useCurrencyService()

const service = useLocationService();

function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}
const currency = ref<ICurrency|null>(null)
onMounted(async()=>{
  const resp = await currencyService.getAll([{
    field:'name',
      matchMode: FilterMatchMode.EQUALS,
    value:'CUP'
  }],new Pagination(0,1),[])
  if(resp && resp.length>0){
    currency.value = resp[0]
  }
})

const table = ref();

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("locations") }}</h1>
      </template>

      <template #toolbar>
        <router-link :to="{ name: 'locations.create' }">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_location'),
              showDelay: 100,
              hideDelay: 300,
            }"
            severity="secondary"
            text
            rounded
            outlined
          />
        </router-link>
      </template>

      <template #column-actions="{ data }">
        <Actions
          :id="data.id"
          :delete-cb="service"
          :editRoute="`locations/${data.id}/edit`"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.name }}
        </div>
      </template>

      <template #column-delivery_price="{ data }">
        <div v-if="data && currency">{{ (data.delivery_price*currency.change_value).toFixed(0)}} {{currency.name}}</div>
        <div v-else-if="data">
{{ data.delivery_price }} USD
        </div>
      </template>

      <template #column-created_at="{ data }">
        <div v-if="data && data.created_at">
          {{ formatDate(data.created_at) }}
        </div>
      </template>
    </Table>
  </div>
</template>
