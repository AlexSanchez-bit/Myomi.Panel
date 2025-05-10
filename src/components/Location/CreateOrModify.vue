<template>
  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <!-- Nombre -->
    <div>
      <label for="name" class="block text-sm font-medium">{{ $t("name") }}</label>
      <InputText
        id="name"
        v-model="form.name"
        :class="{ 'p-invalid': errors.name }"
        class="w-full"
        @input="validateForm"
      />
      <small v-if="errors.name" class="text-red-500">{{ $t(errors.name) }}</small>
    </div>

    <!-- Precio + moneda -->
    <div>
      <label for="delivery" class="block text-sm font-medium">
        {{ $t("delivery_price") }}
      </label>
      <div class="flex w-full items-center space-x-2 border border-gray-300 rounded">
        <!-- Select dentro del input -->
        <select
          v-model="selectedCurrencyId"
          @change="onCurrencyChange"
          class="rounded-l px-2 py-1 text-sm bg-white"
        >
          <option
            v-for="currency in currencies"
            :key="currency.id"
            :value="currency.id"
          >
            {{ currency.name }}
          </option>
        </select>

        <!-- InputNumber ocupa el resto -->
        <InputNumber
          id="delivery"
          v-model="localPrice"
          :class="{ 'p-invalid': errors.delivery_price }"
          class="flex-1 !border-none"
          :minFractionDigits="2"
          :min="0"
          @input="onPriceChange"
        />
      </div>

      <small v-if="errors.delivery_price" class="text-red-500">
        {{ $t(errors.delivery_price) }}
      </small>
      <p v-if="hasConversion" class="text-sm text-gray-600 mt-1">
        ≈ {{ form.delivery_price.toFixed(2) }} USD
      </p>
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create'
          ? $t('create') + ' ' + $t('location')
          : $t('edit') + ' ' + $t('location')
      "
      icon="pi pi-user-plus"
      class="w-full"
      :loading="isSubmitting"
      :disabled="isSubmitting || !!errors.name || !!errors.delivery_price"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
import { useLocationService } from "@/composables/Location/useLocationService";
import { useCurrencyService } from "@/composables/Currency/useCurrencyService";
import type { ILocation } from "@/services/Locations/Locations.service";
import type { ICurrency } from "@/services/Currency/Currency.service";
import { Pagination } from "@/utils/entities/Pagination";

interface Props {
  mode: "create" | "edit";
  location_id?: string;
}

const props = defineProps<Props>();
const { mode, location_id } = props;

const { notify } = useToastStorage();
const service = useLocationService();
const currencyService = useCurrencyService();
const router = useRouter();
const { t } = useI18n();

const currencies = ref<ICurrency[]>([]);
const selectedCurrencyId = ref<number | null>(null);
const usdPrice = ref<number>(0);

const selectedCurrency = computed(() =>
  currencies.value.find((c) => c.id === selectedCurrencyId.value) || null
);

const hasConversion = computed(() => selectedCurrency.value !== null);

const form = ref<Partial<ILocation>>({
  name: "",
  delivery_price: 0, // Siempre en USD
});


const localPrice = computed({
  get(){
    return form.value.delivery_price * (selectedCurrency.value?.change_value??0)
  },
  set(value){
     form.value.delivery_price = value/(selectedCurrency.value?.change_value ??0)
  }
})

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

onMounted(async () => {
  const resp = await currencyService.getAll([], new Pagination(0, 100), []);
  if (resp && resp.length > 0) {
    currencies.value = resp;
    const usd = resp.find((c) => c.name === "CUP");
    selectedCurrencyId.value = usd ? usd.id! : resp[0].id!;
  }

  if (mode === "edit" && location_id) {
    const { data, error } = await service.getDetails(location_id);
    if (!error && data) {
      form.value = data;
      usdPrice.value = data.delivery_price ?? 0;
    } else if (error) {
      notify("error", "Error", error.message, 3000);
    }
  }
});

function validateForm() {
  errors.value = {};

  if (!form.value.name?.trim()) {
    errors.value.name = "El nombre es obligatorio.";
  }

  if (form.value.delivery_price <= 0) {
    errors.value.delivery_price = "El precio debe ser mayor que cero.";
  }


  return Object.keys(errors.value).length === 0;
}

function onCurrencyChange() {
  if (selectedCurrency.value) {
    // Cambio de moneda: recalcular localPrice basado en usdPrice existente
    localPrice.value = usdPrice.value * selectedCurrency.value.change_value;
  }
}

function onPriceChange() {
  if (selectedCurrency.value) {
    form.value.delivery_price = usdPrice.value;
  }
}

async function submitForm() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  const payload = {
    ...form.value,
  };

  let error;
  if (mode === "create") {
    error = await service.create(payload as ILocation);
  } else {
    error = await service.update(location_id!, payload as ILocation);
  }

  if (!error) {
    notify(
      "success",
      "",
      t("location") + " " + (mode === "create" ? t("created") : t("edited")),
      3000
    );
    router.push({ name: "locations" });
  } else {
    notify("error", "", error.message, 3000);
  }

  isSubmitting.value = false;
}
</script>

<style scoped>
.p-invalid {
  border-color: #f87171 !important;
  box-shadow: 0 0 0 1px #f87171 !important;
}
:deep(.p-inputnumber-input,.p-inputnumber-input:focus) {
  border: none !important;

}
</style>
