<template>
  <form class="space-y-4 mb-4" @input="validateForm" @click="validateForm">
    <!-- Nombre -->
    <div>
      <label for="name" class="block text-sm font-medium">{{
        $t("name")
      }}</label>
      <InputText
        id="name"
        v-model="name"
        :class="{ 'p-invalid': errors.name }"
        class="w-full"
        aria-describedby="name-error"
      />
      <small v-if="errors.name" class="text-red-500" id="name-error">{{
        $t(errors.name)
      }}</small>
    </div>
    <div>
      <label for="price" class="block text-sm font-medium">{{
        $t("price")
      }}</label>
      <InputNumber
        id="price"
        v-model="price"
        :class="{ 'p-invalid': errors.price }"
        class="w-full"
        aria-describedby="price-help"
      />
      <small v-if="errors.price" class="text-red-500">{{
        $t(errors.price)
      }}</small>
      <small v-else id="price-help">{{ $t("enter_usd_price") }}</small>
    </div>
    <div>
      <label for="stock" class="block text-sm font-medium">{{
        $t("stock")
      }}</label>
      <InputNumber
        id="stock"
        v-model="stock"
        :class="{ 'p-invalid': errors.stock }"
        class="w-full"
        @input="stock = Math.floor(stock)"
      />
      <small v-if="errors.stock" class="text-red-500">{{
        $t(errors.stock)
      }}</small>
    </div>

    <div>
      <label for="categories" class="block text-sm font-medium">{{
        $t("categories")
      }}</label>

      <MultiSelect
        id="categories"
        v-model="selected_categories"
        :options="categories"
        optionLabel="name"
        optionValue="id"
        class="w-full md:w-14rem"
        :virtualScrollerOptions="{
          lazy: true,
          onLazyLoad: onLazyLoadCategories,
          itemSize: 38,
          showLoader: true,
          loading: categories_loading,
          delay: 250,
        }"
      />

      <small v-if="errors.phone" class="text-red-500">{{
        $t(errors.categoies)
      }}</small>
    </div>

    <div>
      <label for="materials" class="block text-sm font-medium">{{
        $t("materials")
      }}</label>

      <MultiSelect
        id="materials"
        v-model="selected_materials"
        :options="materials"
        optionLabel="name"
        optionValue="id"
        class="w-full md:w-14rem"
        :virtualScrollerOptions="{
          lazy: true,
          onLazyLoad: onLazyLoadMaterials,
          itemSize: 38,
          showLoader: true,
          loading: materials_loading,
          delay: 250,
        }"
      />

      <small v-if="errors.phone" class="text-red-500">{{
        $t(errors.categoies)
      }}</small>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import { useCategoryService } from "@/composables/Shop/Category/useCategoryService";
import { Pagination } from "@/utils/entities/Pagination";
import { useMaterialService } from "@/composables/Shop/Material/useMaterialService";

import MultiSelect from "primevue/multiselect";
const categoriesService = useCategoryService();
const materialService = useMaterialService();

const categories = ref<any[]>([]);
const categoriesTotalCount = ref(1);

const materials = ref<any[]>();
const materialsTotalCount = ref(1);

const onLazyLoadCategories = async (event: { last: number }) => {
  const { last } = event;
  if (last >= categoriesTotalCount.value) return;
  categories_loading.value = true;
  const { data, totalCount: tc } = await categoriesService.getAllTotalCount(
    [],
    new Pagination(last, 5),
    null,
  );
  categoriesTotalCount.value = tc;
  categories.value = [...data];
  categories_loading.value = false;
};

const onLazyLoadMaterials = async (event: { last: number }) => {
  const { last } = event;
  if (last >= materialsTotalCount.value) return;
  materials_loading.value = true;
  const { data, totalCount: tc } = await materialService.getAllTotalCount(
    [],
    new Pagination(last, 5),
    null,
  );
  materialsTotalCount.value = tc;
  materials.value = [...data];
  materials_loading.value = false;
};

onMounted(async () => {
  await onLazyLoadCategories({ last: 0 });
  await onLazyLoadMaterials({ last: 0 });
  validateForm();
});

const name = defineModel<string>("name");
const selected_categories = defineModel<number[]>("categories");
const selected_materials = defineModel<number[]>("materials");
const price = defineModel<number>("price");
const stock = defineModel<number>("stock");

// Validaciones y errores
const errors = ref<Record<string, string>>({});
const categories_loading = ref(false);
const materials_loading = ref(false);

const emit = defineEmits<{
  (e: "validForm", valid: boolean): void;
}>();

function validateForm() {
  errors.value = {};

  // Validar nombre
  if (!name.value || name.value.trim().length == 0) {
    errors.value.name = "El nombre es obligatorio.";
  }

  if (!price.value) {
    price.value = 0;
  }
  if (price.value && price.value < 0) {
    price.value = 0;
    errors.value.price = "El precio debe ser >= a 0";
  }

  if (!stock.value) {
    stock.value = 0;
  }
  if (stock.value && stock.value < 0) {
    price.value = 0;
    errors.value.stock = "No se admiten cantidades negativas";
  }

  if (selected_categories.value && selected_categories.value.length == 0) {
    errors.value.name = "Seleccione al menos una categoría";
  }

  const error = Object.keys(errors.value).length;
  if (error > 0) {
    emit("validForm", false);
  } else {
    emit("validForm", true);
  }

  return error === 0;
}
</script>
