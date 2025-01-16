<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import { useUserService } from "@/composables/Users/useUserService";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import AddUser from "@/components/Users/AddUser.vue";

import { ref } from "vue";

const { userService } = useUserService();
function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const create_active = ref(false);
const table = ref();

function refresh() {
  table.value.refresh();
}

function open_create_user() {
  create_active.value = true;
}
</script>
<template>
  <div>
    <Table ref="table" :dataService="userService" :columns="table_configs">
      <template #header>
        <h1 class="">Usuarios</h1>
      </template>

      <template #toolbar>
        <router-link :to="{ name: 'users.create' }">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_user'),
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
          :user_data="data"
          @removed="refresh"
          @edited="refresh"
          v-if="data"
        ></Actions>
      </template>

      <template #column-created_at="{ data }">
        <div v-if="data && data.created_at">
          {{ formatDate(data.created_at) }}
        </div>
      </template>
    </Table>
  </div>
</template>
