<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import { useOrderService } from "@/composables/Order/useOrderService";
import { OrderStatus } from "@/services/Order/Order.service";
import { computed, ref } from "vue";
import Dropdown from "primevue/dropdown";
const service = useOrderService();

const table = ref();

const refresh = () => {
  table.value.refresh();
};

const changeOrder = async (order_id: number, new_status: string) => {
  const error = await service.update(order_id, { status: new_status });
  console.log(error);
  table.value.refresh();
};

function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const statuses = Object.keys(OrderStatus);
const aviable_statuses = (status) => {
  switch (status) {
    case OrderStatus.CREATED:
      return statuses;
    case OrderStatus.PAID:
      return [OrderStatus.DELIVERED];
    case OrderStatus.CANCELED:
      return [];
    case OrderStatus.DELIVERED:
      return [];
  }
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("orders") }}</h1>
      </template>

      <!-- <template #toolbar> -->
      <!--   <router-link :to="{ name: 'orders.create' }"> -->
      <!--     <Button -->
      <!--       icon="pi pi-plus" -->
      <!--       v-tooltip.bottom="{ -->
      <!--         value: $t('create_order'), -->
      <!--         showDelay: 100, -->
      <!--         hideDelay: 300, -->
      <!--       }" -->
      <!--       severity="secondary" -->
      <!--       text -->
      <!--       rounded -->
      <!--       outlined -->
      <!--     /> -->
      <!--   </router-link> -->
      <!-- </template> -->

      <template #column-actions="{ data }">
        <Actions
          :id="data.id"
          :delete-cb="service.remove"
          :editRoute="`/orders/${data.id}/edit`"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-user="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.user?.name ?? $t("anonymous") }}
        </div>
      </template>

      <template #column-created_at="{ data }">
        <span v-if="data && data.created_at" class="text-md text-gray-700">
          {{ formatDate(data.created_at) }}
        </span>
      </template>

      <template #column-change="{ data }">
        <div v-if="data && data.total" class="flex flex-row items-center">
          {{ data.change * data.currency.change_value }}
          {{ data.currency.name }}
        </div>
      </template>

      <template #column-total="{ data }">
        <div v-if="data && data.total" class="flex flex-row items-center">
          {{ data.total * data.currency.change_value }} {{ data.currency.name }}
          <span v-if="data.delivery_payment">
            +
            {{ data.delivery_payment * data.delivery_currency.change_value }}
            {{ data.delivery_currency.name }}
          </span>
        </div>
      </template>

      <template #column-status="{ data }">
        <p v-if="data && data.status" class="text-md text-gray-700">
          <Dropdown
            :model-value="data.status"
            display="chip"
            id="statuses"
            :options="aviable_statuses(data.status)"
            class="min-w-36 !border-none !bg-transparent hover:!!border-gray-400"
            @change="changeOrder(data.id, $event.value)"
          >
            <template #value="slotProps">
              <div class="flex align-items-center">
                <div>{{ $t(`order_status.${slotProps.value}`) }}</div>
              </div>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>{{ $t(`order_status.${slotProps.option}`) }}</div>
              </div>
            </template>
          </Dropdown>
        </p>
      </template>

      <template #filter-status="{ filterModel, filterCallback }">
        <MultiSelect
          v-model="filterModel.value"
          display="chip"
          id="statuses"
          :options="statuses"
          class="min-w-36"
          @change="filterCallback"
        >
          <template #chip="slotProps">
            <div class="flex align-items-center">
              <div>{{ $t(`order_status.${slotProps.value}`) }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ $t(`order_status.${slotProps.option}`) }}</div>
            </div>
          </template>
        </MultiSelect>
      </template>
    </Table>
  </div>
</template>
