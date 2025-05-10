<script setup lang="ts">
import Avatar from "primevue/avatar"
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";
import MultiSelect from "primevue/multiselect";
import { useOrderService } from "@/composables/Order/useOrderService";
import { OrderStatus } from "@/services/Order/Order.service";
import Dropdown from "primevue/dropdown";
import UserFilter from "@/components/Orders/UserFilter.vue";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
import Actions from "@/components/Shop/Order/Actions.vue"
import {usePaymentTypeService} from "@/composables/PayentTypes/usePaymentTypeService"
import {Pagination} from "@/utils/entities/Pagination"
import {ref,onMounted,computed} from 'vue'
const service = useOrderService();
const pay_type_service = usePaymentTypeService()

const payment_types = ref([])

const table = ref();

onMounted(async()=>{
  payment_types.value = await pay_type_service.getAll([],new Pagination(0,100),[])
  console.log(payment_types.value)

})

const refresh = () => {
  table.value.refresh();
};

const { notify } = useToastStorage();
const { t } = useI18n();

const changeOrder = async (order_id: number, new_status: OrderStatus) => {
  const error = await service.update(order_id, { status: new_status });
  if (!error) {
    refresh();
  } else {
    notify("error", t("an_error_ocurred"), error.message, 3000);
  }
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

      <template #column-actions="{data}">
        <div>
          <Actions :order="data"  v-if="data"/> 
        </div>
      </template>

      <template #column-user="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.user?.name ?? $t("anonymous") }}
        </div>
      </template>

      <template #filter-user="{ filterModel, filterCallback }">
        <UserFilter
          v-model:value="filterModel.value"
          v-model:matchMode="filterModel.matchMode"
          @reload="filterCallback"
        />
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
          {{ (data.total * data.currency.change_value).toFixed(2) }} {{ data.currency.name }}
          <span v-if="data.delivery_payment">
            +
            {{ (data.delivery_payment * data.delivery_currency.change_value).toFixed(2) }}
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

      <template #column-payment_type="{data}">
        <div v-if="data && data.payment_type" class="flex flex-row items-center gap-2">
          <Avatar :src="data.payment_type.icon" /> {{data.payment_type.name}}
        </div>
        <div v-else-if="data">Eliminado</div>
      </template>


      <template #filter-payment_type="{ filterModel, filterCallback }">
        <MultiSelect
          v-model="filterModel.value"
          display="chip"
          id="statuses"
          :options="payment_types"
          optionValue="id"
          optionLabel="name"
          class="min-w-36"
          @change="filterCallback"
        >
          <template #chip="slotProps">
            <div class="flex align-items-center">
              <div>{{ payment_types.find(e=>e.id == slotProps.value).name }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ $t(`${slotProps.option.name}`) }}</div>
            </div>
          </template>
        </MultiSelect>
      </template>


    </Table>
  </div>
</template>
