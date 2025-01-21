<template>
  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <!-- Nombre -->
    <div>
      <label for="name" class="block text-sm font-medium">{{
        $t("name")
      }}</label>
      <InputText
        id="name"
        v-model="form.name"
        :class="{ 'p-invalid': errors.name }"
        class="w-full"
      />
      <small v-if="errors.name" class="text-red-500">{{
        $t(errors.name)
      }}</small>
    </div>

    <div>
      <label for="usd_based_value" class="block text-sm font-medium">{{
        $t("usd_relative_value")
      }}</label>
      <InputNumber
        id="usd_based_value"
        v-model="form.change_value"
        mode="decimal"
        :maxFractionDigits="4"
        :class="{ 'p-invalid': errors.change_value }"
        class="w-full"
      />
      <small>1 USD = {{ form.change_value }} {{ form.name }}</small>
      <small v-if="errors.change_value" class="text-red-500">{{
        $t(errors.change_value)
      }}</small>
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create'
          ? $t('create') + ' ' + $t('currency')
          : $t('edit') + ' ' + $t('currency')
      "
      icon="pi pi-user-plus"
      class="w-full"
      :disabled="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
import { useCurrencyService } from "@/composables/Currency/useCurrencyService";
import type { ICurrency } from "@/services/Currency/Currency.service";
const { notify } = useToastStorage();
const service = useCurrencyService();
const router = useRouter();

interface Props {
  mode: "create" | "edit";
  currency_id?: string;
}

const props = defineProps<Props>();
const { mode, currency_id } = props;

onMounted(async () => {
  if (mode == "edit") {
    const { data, error } = await service.getDetails(currency_id!);
    if (!error) {
      form.value = data;
    } else {
      notify(
        "error",
        "Hubo un problema buscando la moneda",
        error.message,
        3000,
      );
    }
  }
});

// Modelo del formulario

// Estado reactivo para el formulario
const form = ref<Partial<ICurrency>>({
  name: "",
});

// Validaciones y errores
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validateForm() {
  errors.value = {};

  // Validar nombre
  if (!form.value.name.trim()) {
    errors.value.name = "El nombre es obligatorio.";
  }

  if (form.value.change_value < 0) {
    errors.value.change_value = "El valor debe ser positivo.";
  }

  return Object.keys(errors.value).length === 0;
}

const { t } = useI18n();

async function submitForm() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  if (mode == "create") {
    const error = await service.create({
      ...(form.value as ICurrency),
    });

    if (!error) {
      notify("success", "", t("currency") + " " + t("created"), 3000);

      router.push({ name: "currencies" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await service.update(currency_id, {
      ...(form.value as ICurrency),
    });

    if (!error) {
      notify("success", "", t("currency") + " " + t("edited"), 3000);
      router.push({ name: "currencies" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }
}
</script>

<style>
/* Estilo adicional para inputs inválidos */
.p-invalid {
  border-color: #f87171 !important;
  box-shadow: 0 0 0 1px #f87171 !important;
}
</style>
