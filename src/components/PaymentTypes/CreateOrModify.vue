<template>
  <!-- Gestión del icono -->
  <div class="flex justify-start mb-4">
    <div class="relative">
      <p class="text-center absolute top-0 left-2">
        {{ $t("icon") }}
      </p>
      <img
        :src="profileImage"
        class="w-24 h-24 border border-gray-300 object-cover"
      />
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="onProfileImageChange"
      />
      <i
        class="pi pi-upload pi-2x absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-darkblue"
      ></i>
    </div>
  </div>

  <!-- Formulario de Tipo de Pago -->
  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <!-- Nombre -->
    <div>
      <label for="name" class="block text-sm font-medium">
        {{ $t("name") }}
      </label>
      <InputText
        id="name"
        v-model="form.name"
        :class="{ 'p-invalid': errors.name }"
        class="w-full"
      />
      <small v-if="errors.name" class="text-red-500">
        {{ $t(errors.name) }}
      </small>
    </div>
    <!-- External -->
    <div class="flex items-center">
      <Checkbox v-model="form.external" binary />
      <label class="ml-2 text-sm font-medium">{{ $t("external") }}</label>
    </div>
    <!-- Delivery Included -->
    <div class="flex items-center">
      <Checkbox v-model="form.delivery_included" binary />
      <label class="ml-2 text-sm font-medium">
        {{ $t("delivery_included") }}
      </label>
    </div>
    <!-- Delivery Currency (selección única, solo activa si delivery_included es true) -->
    <div v-if="!form.delivery_included">
      <label for="delivery_currency" class="block text-sm font-medium">
        {{ $t("delivery_currency") }}
      </label>
      <Dropdown
        id="delivery_currency"
        v-model="form.delivery_currency"
        :options="currencies"
        optionLabel="name"
        optionValue="id"
        class="w-full"
      />
    </div>
    <!-- Allowed Currencies -->
    <div>
      <label for="allowed_currencies" class="block text-sm font-medium">
        {{ $t("allowed_currencies") }}
      </label>
      <MultiSelect
        id="allowed_currencies"
        v-model="form.allowed_currencies"
        :options="currencies"
        optionLabel="name"
        optionValue="id"
        class="w-full"
      />
      <small v-if="errors.allowed_currencies" class="text-red-500">
        {{ $t(errors.allowed_currencies) }}
      </small>
    </div>
    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create' ? $t('create_payment_type') : $t('edit_payment_type')
      "
      class="w-full"
      :disabled="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { IPaymentType } from "@/services/PaymentType/PaymentTypeService";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useCurrencyService } from "@/composables/Currency/useCurrencyService";
import { Pagination } from "@/utils/entities/Pagination";
import { usePaymentTypeService } from "@/composables/PayentTypes/usePaymentTypeService";

interface Props {
  mode: "create" | "edit";
  paymentTypeId?: number;
}
const props = defineProps<Props>();
const { mode, paymentTypeId } = props;

const form = reactive<Partial<IPaymentType>>({
  external: false,
  delivery_included: false,
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const currencies = ref<Array<{ id: number; name: string }>>([]);

// Para modo edición, se guardan las monedas permitidas originales
const originalAllowedCurrencies = ref<number[]>([]);

const paymentTypeService = usePaymentTypeService();
const { notify } = useToastStorage();
const router = useRouter();
const { t } = useI18n();

// Gestión del icono
const profileImage = ref<string | null>(null);
const profileImageFile = ref<File | null>(null);
function onProfileImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    profileImageFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const currenciesService = useCurrencyService();

onMounted(async () => {
  if (mode === "edit" && paymentTypeId) {
    const { data, error } = await paymentTypeService.getDetails(paymentTypeId);
    if (!error && data) {
      form.name = data.name;
      form.icon = data.icon;
      form.external = data.external;
      form.delivery_included = data.delivery_included;
      form.delivery_currency = data.delivery_currency;
      form.allowed_currencies = data.allowed_currencies.map(
        (curr) => curr.currency_id,
      );
      originalAllowedCurrencies.value = [...form.allowed_currencies];
      profileImage.value = data.icon;
    } else {
      notify(
        "error",
        "Error",
        error?.message || "Error al cargar el tipo de pago",
        3000,
      );
    }
  }
  // Cargar todas las monedas disponibles
  currencies.value = await currenciesService.getAll(
    [],
    new Pagination(0, 100),
    [],
  );
});

// Si delivery_included se desactiva, se limpia el valor de delivery_currency
watch(
  () => form.delivery_included,
  (newVal) => {
    if (!newVal) {
      form.delivery_currency = null;
    }
  },
);

function validateForm() {
  errors.value = {};
  if (!form.name.trim()) {
    errors.value.name = "El nombre es obligatorio.";
  }
  if (!form.allowed_currencies || form.allowed_currencies?.length === 0) {
    errors.value.allowed_currencies =
      "Seleccione al menos una moneda permitida.";
  }
  return Object.keys(errors.value).length === 0;
}

async function submitForm() {
  if (!validateForm()) return;
  isSubmitting.value = true;

  let iconUrl = form.icon;
  if (profileImageFile.value) {
    iconUrl = await uploadPublicFile(profileImageFile.value);
    if (!iconUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }
  form.icon = iconUrl;

  if (mode === "create") {
    const error = await paymentTypeService.create({
      id: 0,
      name: form.name,
      icon: form.icon,
      external: form.external,
      delivery_included: form.delivery_included,
      delivery_currency: form.delivery_currency,
      allowed_currencies: form.allowed_currencies,
    } as IPaymentType);
    if (!error) {
      notify("success", "", t("payment_type_created"), 3000);
      router.push({ name: "payment_types" });
    } else {
      notify("error", "", error.message, 3000);
    }
  }

  if (mode === "edit" && paymentTypeId) {
    const error = await paymentTypeService.update(paymentTypeId, {
      id: paymentTypeId,
      name: form.name,
      icon: form.icon,
      external: form.external,
      delivery_included: form.delivery_included,
      delivery_currency: form.delivery_currency,
    } as IPaymentType);
    if (!error) {
      await paymentTypeService.update_currency(
        paymentTypeId,
        originalAllowedCurrencies.value,
        form.allowed_currencies,
      );
      notify("success", "", t("payment_type_edited"), 3000);
      router.push({ name: "payment_types" });
    } else {
      notify("error", "", error.message, 3000);
    }
  }
  isSubmitting.value = false;
}
</script>

<style>
.p-invalid {
  border-color: #f87171 !important;
  box-shadow: 0 0 0 1px #f87171 !important;
}
</style>
