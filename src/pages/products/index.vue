<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";

import Button from "primevue/button";

import { onMounted, ref } from "vue";
import { useProductService } from "@/composables/Shop/Product/useProductService";
import { Pagination } from "@/utils/entities/Pagination";
import { useBrandService } from "@/composables/Shop/Brand/useBrandService";
import Dropdown from "primevue/dropdown";

const service = useProductService();

function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const table = ref();

const refresh = () => {
  table.value.refresh();
};

const brands = ref<any[]>([]);
const brandsTotalCount = ref(1);
const brands_loading = ref(false);
const brandsService = useBrandService();

const onLazyLoadBrands = async (event: { last: number }) => {
  const { last } = event;
  if (last >= brandsTotalCount.value) return;
  brands_loading.value = true;
  const { data, totalCount: tc } = await brandsService.getAllTotalCount(
    [],
    new Pagination(last, 1000),
    null,
  );
  brandsTotalCount.value = tc * 1000;
  brands.value = [...brands.value, ...data];
  brands_loading.value = false;
};
onMounted(async () => {
  await onLazyLoadBrands({ last: 0 });
});
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
          :delete-cb="service"
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
          <Avatar :image="data?.brand.icon" size="normal" />
          <router-link
            class="ml-2 text-blue-500 hover:text-blue-700"
            :to="{ name: 'brands.edit', params: { id: data.brand.id } }"
          >
            {{ data?.brand.name }}
          </router-link>
        </div>
      </template>

      <template #filter-brand="{ filterModel, filterCallback }">
        <Dropdown
          v-model="filterModel.value"
          id="brand"
          :options="brands"
          optionLabel="name"
          optionValue="id"
          class="min-w-36"
          @change="filterCallback"
        >
          <template #option="slotProps">
            <div class="flex align-items-center items-center gap-2">
              <Avatar :image="slotProps.option.icon" size="normal" />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Dropdown>
      </template>

      <template #column-price="{ data }">
        <div v-if="data">{{ data.price }} USD</div>
      </template>

      <template #column-created_at="{ data }">
        <div v-if="data && data.created_at">
          {{ formatDate(data.created_at) }}
        </div> </template
      >c
    </Table>
  </div>
</template>
<style scoped>
:deep(.p-avatar img) {
  object-fit: scale-down;
}
</style>
