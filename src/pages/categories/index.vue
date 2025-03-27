<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import Button from "primevue/button";
import { ref } from "vue";
import { useCategoryService } from "@/composables/Shop/Category/useCategoryService";

const service = useCategoryService();
function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}
import { useToastStorage } from "@/stores/ToasterStorage";
const { notify } = useToastStorage();

const table = ref();

const updateOrder = async (id: string, order: number) => {
  const resp = await service.update(id, { order });
  if (resp) {
    notify("danger", "", "Ocurrio un error", 3000);
  } else {
    refresh();
  }
};

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("categories") }}</h1>
      </template>

      <template #toolbar>
        <router-link to="categories/create">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_category'),
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
          :editRoute="`/categories/${data.id}/edit`"
          :delete-cb="service"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          <Avatar :image="data?.icon" class="mr-2" size="large" />
          {{ data?.name }}
        </div>
      </template>

      <template #column-category="{ data }">
        <div class="flex flex-row items-center">
          {{ data?.category?.name }}
        </div>
      </template>

      <template #column-order="{ data }">
        <div class="flex flex-row items-center" v-if="data">
          <input
            type="number"
            :modelValue="data?.order"
            :value="data?.order"
            class="w-12 h-8"
            @input="(e) => updateOrder(data.id, (e.target as any).value)"
            name=""
            id=""
          />
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
