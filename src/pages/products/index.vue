<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";

import Button from "primevue/button";

import { ref } from "vue";
import { useProductService } from "@/composables/Shop/Product/useProductService";

const service = useProductService();

function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const table = ref();

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("products") }}</h1>
      </template>

      <template #toolbar>
        <router-link :to="{ name: 'products.create' }">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_product'),
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
          :delete-cb="service.remove"
          :editRoute="`/products/${data.id}/edit`"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.name }}
        </div>
      </template>

      <template #column-brand="{ data }">
        <div v-if="data && data.brand" class="flex flex-row items-center">
          {{ data?.brand.name }}
        </div>
      </template>

      <template #column-price="{ data }">
        <div v-if="data">{{ data.price }} USD</div>
      </template>

      <template #column-created_at="{ data }">
        <div v-if="data && data.created_at">
          {{ formatDate(data.created_at) }}
        </div>
      </template>
    </Table>
  </div>
</template>
