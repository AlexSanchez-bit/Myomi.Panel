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
        @input="validateForm"
      />
      <small v-if="errors.name" class="text-red-500">{{
        $t(errors.name)
      }}</small>
    </div>

    <div>
      <label for="delivery" class="block text-sm font-medium">{{
        $t("delivery_price")
      }}</label>
      <InputNumber
        id="delivery"
        v-model="form.delivery_price"
        :class="{ 'p-invalid': errors.delivery_price }"
        class="w-full"
        :minFractionDigits="2"
        fluid
        @input="validateForm"
        inputId="currency-us"
        suffix=" USD"
        :min="0"
      />
      <small v-if="errors.delivery_price" class="text-red-500">{{
        $t(errors.delivery_price)
      }}</small>
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
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
import { useLocationService } from "@/composables/Location/useLocationService";
import type { ILocation } from "@/services/Locations/Locations.service";
const { notify } = useToastStorage();
const service = useLocationService();
const router = useRouter();

interface Props {
  mode: "create" | "edit";
  location_id?: string;
}

const props = defineProps<Props>();
const { mode, location_id } = props;

onMounted(async () => {
  if (mode == "edit") {
    const { data, error } = await service.getDetails(location_id!);
    if (!error) {
      form.value = data;
    } else {
      notify(
        "error",
        "Hubo un problema buscando la categoría",
        error.message,
        3000,
      );
    }
  }
});

// Modelo del formulario

// Estado reactivo para el formulario
const form = ref<Partial<ILocation>>({
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

  if (!form.value.delivery_price) {
    errors.value.delivery_price = "El precio es obligatorio";
  }
  if (form.value.delivery_price && form.value.delivery_price < 0) {
    errors.value.delivery_price = "El precio debe ser >=0";
  }

  return Object.keys(errors.value).length === 0;
}

const { t } = useI18n();

async function submitForm() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  if (mode == "create") {
    const error = await service.create({ ...(form.value as ILocation) });

    if (!error) {
      notify("success", "", t("location") + " " + t("created"), 3000);

      router.push({ name: "locations" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await service.update(location_id, {
      ...(form.value as ILocation),
    });

    if (!error) {
      notify("success", "", t("location") + " " + t("edited"), 3000);
      router.push({ name: "locations" });
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
