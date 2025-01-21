<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import Button from "primevue/button";
import { ref } from "vue";
import { useMaterialService } from "@/composables/Shop/Material/useMaterialService";

const service = useMaterialService();

const table = ref();

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("materials") }}</h1>
      </template>

      <template #toolbar>
        <router-link to="materials/create">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_material'),
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
          :editRoute="`/materials/${data.id}/edit`"
          :delete-cb="service.deleteMaterial"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.name }}
        </div>
      </template>
    </Table>
  </div>
</template>
