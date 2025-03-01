<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";

import Button from "primevue/button";

import { onMounted, ref } from "vue";
import { Pagination } from "@/utils/entities/Pagination";
import Dropdown from "primevue/dropdown";
import { usePaymentTypeService } from "@/composables/PayentTypes/usePaymentTypeService";
import { useCurrencyService } from "@/composables/Currency/useCurrencyService";
import MultiSelect from "primevue/multiselect";

const service = usePaymentTypeService();

const table = ref();

const refresh = () => {
  table.value.refresh();
};

const currency = ref<any[]>([]);
const currencyTotalCount = ref(1);
const currency_loading = ref(false);
const currencyService = useCurrencyService();

const onLazyLoadCurrencies = async (event: { last: number }) => {
  const { last } = event;
  if (last >= currencyTotalCount.value) return;
  currency_loading.value = true;
  const { data, totalCount: tc } = await currencyService.getAllTotalCount(
    [],
    new Pagination(last, 100),
    null,
  );
  currencyTotalCount.value = tc;
  currency.value = [...data];
  currency_loading.value = false;
};
onMounted(async () => {
  await onLazyLoadCurrencies({ last: 0 });
});
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">{{ $t("payment_types") }}</h1>
      </template>

      <template #toolbar>
        <router-link :to="{ name: 'payment_types.create' }">
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: $t('create_payment_type'),
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
          :editRoute="`/payment-types/${data.id}/edit`"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.name }}
        </div>
      </template>

      <template #column-allowed_currencies="{ data }">
        <div
          v-if="data && data.allowed_currencies"
          class="flex flex-row items-center"
        >
          <span
            v-for="currency_data in data.allowed_currencies"
            :key="currency_data.id"
          >
            <Avatar
              :image="currency_data?.currency.icon"
              size="normal"
              shape="circle"
            />
          </span>
        </div>
      </template>

      <template #column-external="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data.external ? $t("yes") : $t("no") }}
        </div>
      </template>
      <template #column-may_have_change="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data.may_have_change ? $t("yes") : $t("no") }}
        </div>
      </template>
      <template #column-delivery_included="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data.delivery_included ? $t("yes") : $t("no") }}
        </div>
      </template>

      <template #column-icon="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          <Avatar
            :image="data?.icon"
            class="mr-2"
            size="normal"
            shape="square"
          />
        </div>
      </template>

      <template #filter-allowed_currencies="{ filterModel, filterCallback }">
        <MultiSelect
          v-model="filterModel.value"
          id="currency"
          :options="currency"
          optionLabel="name"
          optionValue="id"
          class="min-w-36"
          @change="filterCallback"
          :virtualScrollerOptions="{
            lazy: true,
            onLazyLoad: onLazyLoadCurrencies,
            itemSize: 38,
            showLoader: true,
            loading: currency_loading,
            delay: 250,
          }"
        >
          <template #option="slotProps">
            <div class="flex align-items-center">
              <Avatar :image="slotProps.option.icon" size="normal" />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </MultiSelect>
      </template>
    </Table>
  </div>
</template>
