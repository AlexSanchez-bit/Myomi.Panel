<script setup lang="ts">
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import { useNewsLetterService } from "./composables/useNewsLetterService";
const { newsLetterService } = useNewsLetterService();
function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}
</script>
<template>
  <div>
    <Table :dataService="newsLetterService" :columns="table_configs">
      <template #header>
        <h1 class="font-albra-serif-bold">Newsletter</h1>
      </template>

      <template #column-created_at="{ data }">
        <div v-if="data && data.created_at">
          {{ formatDate(data.created_at) }}
        </div>
      </template>
    </Table>
  </div>
</template>
