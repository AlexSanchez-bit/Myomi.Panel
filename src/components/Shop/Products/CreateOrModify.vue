<template>
  <div class="card">
    <Steps
      :model="steps"
      :readonly="false"
      :activeStep="active_step"
      class="mb-4"
      @update:activeStep="(e) => (active_step = e)"
    >
      <template #item="{ item, active }">
        <div class="flex flex-col items-center justify-start">
          <!-- Círculo del Step -->
          <span
            :class="[
              'inline-flex items-center justify-center rounded-full border h-12 w-12 z-[1] cursor-pointer', // Base de estilos
              active
                ? 'bg-darkblue border-darkblue text-wood'
                : 'border-primary bg-white text-primary', // Estilos condicionales
            ]"
          >
            <i :class="[item.icon, 'text-xl']"></i>
          </span>
          <!-- Etiqueta del Step -->
          <p
            :class="[
              'cursor-pointer',
              active ? 'text-darkblue' : 'text-primary',
            ]"
          >
            {{ $t(item.label) }}
          </p>
        </div>
      </template>
    </Steps>
    <div class="px-4 min-h-64 my-3">
      <GeneralInfoForm
        @validForm="(e) => (isValidForm = e)"
        v-show="active_step == 0"
        v-model:name="form.name"
        v-model:categories="form.categories"
        v-model:materials="form.materials"
        v-model:price="form.price"
      />
      <Description
        v-show="active_step == 1"
        v-model:short_description="form.short_description"
        v-model:long_description="form.long_description"
      />
      <ImageSelector
        v-show="active_step == 2"
        v-model:images="form.images"
        ref="images"
      />
    </div>
    <Button
      :label="$t(mode == 'create' ? 'create_product' : 'edit_product')"
      class="w-full"
      :severity="isValidForm ? 'success' : 'danger'"
      :outlined="!isValidForm"
      :loading="isSubmitting"
      @click="submitForm"
      :disabled="isSubmitting || !isValidForm"
    >
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import Steps from "primevue/steps";
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import GeneralInfoForm from "@/components/Shop/Products/GeneralInfoForm.vue";
import Description from "@/components/Shop/Products/Description.vue";
import ImageSelector from "@/components/Shop/Products/ImageSelector.vue";
import { useI18n } from "vue-i18n";
import { useProductService } from "@/composables/Shop/Product/useProductService";
import type { IProduct } from "@/services/Shops/Products/Products.service";
import { reactive } from "vue";
const { notify } = useToastStorage();
const productsService = useProductService();

const { t } = useI18n();

const router = useRouter();
const isSubmitting = ref(false);
const images = ref();

interface Props {
  mode: "create" | "edit";
  product_id?: number;
}

const props = defineProps<Props>();
const { mode, product_id } = props;

const steps = ref([
  {
    label: "general_info",
    icon: "pi pi-list",
  },
  {
    label: "description",
    icon: "pi pi-pencil",
  },
  {
    label: "images",
    icon: "pi pi-image",
  },
]);

const active_step = ref(0);
const isValidForm = ref(false);

const originalCategories = ref([]);
const originalMaterials = ref([]);

onMounted(async () => {
  if (mode == "edit") {
    const { data, error } = await productsService.getDetails(product_id!);
    if (!error) {
      form.name = data.name;
      form.images = data.images;
      form.price = data.price;
      form.categories = data.categories;
      form.materials = data.materials;
      form.short_description = data.short_description;
      form.long_description = data.long_description;

      originalCategories.value = data.categories;
      originalMaterials.value = data.materials;
    } else {
      notify(
        "error",
        "Hubo un problema buscando el producto",
        error.message,
        3000,
      );
    }
  }
});

// Estado reactivo para el formulario
const form = reactive<Partial<IProduct>>({});

async function submitForm() {
  if (!isValidForm.value) return;

  isSubmitting.value = true;
  form.images = await images.value.uploadImages();
  if (mode == "create") {
    const error = await productsService.create({
      ...(form as IProduct),
    });

    if (!error) {
      notify("success", "", t("product_created"), 3000);

      router.push({ name: "products" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await productsService.update(product_id!, {
      ...(form as IProduct),
    });

    await productsService.update_categories(
      product_id!,
      originalCategories.value,
      form.categories,
    );
    await productsService.update_materials(
      product_id!,
      originalMaterials.value,
      form.materials,
    );

    if (!error) {
      notify("success", "", t("product_edited"), 3000);
      router.push({ name: "products" });
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
