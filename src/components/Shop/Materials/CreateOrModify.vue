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
      <label for="description" class="block text-sm font-medium">{{
        $t("description")
      }}</label>
      <TinyMce
        id="description"
        :value="form.description"
        menubar="format"
        @input="form.description = $event"
      />
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create'
          ? $t('create') + ' ' + $t('material')
          : $t('edit') + ' ' + $t('material')
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
import Button from "primevue/button";
import TinyMce from "@/components/Tinymce/index.vue";
import { useMaterialService } from "@/composables/Shop/Material/useMaterialService";
import { useRouter } from "vue-router";
import { Pagination } from "@/utils/entities/Pagination";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
const { notify } = useToastStorage();
const service = useMaterialService();
const router = useRouter();

interface Props {
  mode: "create" | "edit";
  material_id?: string;
}

const props = defineProps<Props>();
const { mode, material_id } = props;

onMounted(async () => {
  if (mode == "edit") {
    const { data, error } = await service.getDetails(material_id!);
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
interface MaterialForm {
  name: string;
  description?: string;
}

// Estado reactivo para el formulario
const form = ref<MaterialForm>({
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

  return Object.keys(errors.value).length === 0;
}

const { t } = useI18n();

async function submitForm() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  if (mode == "create") {
    const error = await service.createMaterial(
      form.value.name,
      form.value.description,
    );

    if (!error) {
      notify("success", "", t("material") + " " + t("created"), 3000);

      router.push({ name: "materials" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await service.updateMaterial(
      material_id,
      form.value.name,
      form.value.description,
    );

    if (!error) {
      notify("success", "", t("material") + " " + t("edited"), 3000);
      router.push({ name: "materials" });
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
