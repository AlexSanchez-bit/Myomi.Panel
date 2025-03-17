<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import Button from "primevue/button";
import { ref } from "vue";
import { useConcernService } from "@/composables/Shop/Concern/useConcernService";

const service = useConcernService();

const table = ref();

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("concerns") }}</h1>
      </template>

      <template #toolbar>
        <router-link to="concerns/create">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_concern'),
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
          :editRoute="`/concern/${data.id}/edit`"
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
    </Table>
  </div>
</template>
