<template>
  <div class="flex justify-start mb-4">
    <div class="relative">
      <p class="text-center absolute top-0 left-2">
        {{ $t("icon") }}
      </p>
      <img
        :src="profileImage ?? '/extras/defaultprofile.jpg'"
        alt=""
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

  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <div>
      <label for="order" class="block text-sm font-medium">{{
        $t("order")
      }}</label>
      <InputNumber id="order" v-model="form.order" class="w-3 h-8" />
    </div>
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
      <label for="parent" class="block text-sm font-medium">{{
        $t("parent")
      }}</label>

      <Dropdown
        v-model="form.parent"
        :options="categories"
        optionLabel="name"
        optionValue="id"
        class="w-full md:w-14rem"
        :virtualScrollerOptions="{
          lazy: true,
          onLazyLoad: onLazyLoad,
          itemSize: 38,
          showLoader: true,
          loading: loading,
          delay: 250,
        }"
      />

      <small v-if="errors.phone" class="text-red-500">{{
        $t(errors.phone)
      }}</small>
    </div>

    <!-- Apellidos -->
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

    <!-- Número Telefónico -->

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="mode === 'create' ? $t('create_category') : $t('edit_category')"
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
import Dropdown from "primevue/dropdown";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useRouter } from "vue-router";
const service = useCategoryService();
import { useToastStorage } from "@/stores/ToasterStorage";
import { useCategoryService } from "@/composables/Shop/Category/useCategoryService";
import { Pagination } from "@/utils/entities/Pagination";
import { useI18n } from "vue-i18n";
import type { ICategory } from "@/services/Shops/Categories/Category.service";
import InputNumber from "primevue/inputnumber";
const { notify } = useToastStorage();

const { t } = useI18n();

const router = useRouter();
const loading = ref(false);

interface Props {
  mode: "create" | "edit";
  category_id?: string;
  createdCb?: (id: string) => void;
}

const props = defineProps<Props>();
const { mode, category_id } = props;

const categories = ref<any[]>([]);
const totalCount = ref(1);

const onLazyLoad = async (event: { last: number }) => {
  const { last } = event;
  console.log(last, totalCount.value);
  if (last >= totalCount.value / 5) return;
  const { data, totalCount: tc } = await service.getAllTotalCount(
    [],
    new Pagination(last, 5),
    null,
  );
  totalCount.value = tc;
  categories.value = [...data, { id: null, name: "Ninguna" }];
};

onMounted(async () => {
  onLazyLoad({ last: 0 });
  if (mode == "edit") {
    const { data, error } = await service.getDetails(category_id!);
    if (!error) {
      form.value = data;
      profileImage.value = data.icon;
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
const form = ref<ICategory>({
  name: "",
  order: 0,
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

// Foto de perfil
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

async function submitForm() {
  if (!validateForm()) return;

  let imageUrl = profileImage.value;
  isSubmitting.value = true;
  if (profileImageFile.value) {
    imageUrl = await uploadPublicFile(profileImageFile.value);
    if (!imageUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }

  if (mode == "create") {
    const error = await service.create({
      name: form.value.name,
      parent: form.value.parent,
      icon: imageUrl,
      description: form.value.description,
      order: form.value.order,
    });

    if (!error) {
      notify("success", "", t("category_created"), 3000);

      router.push({ name: "categories" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await service.update(category_id, {
      name: form.value.name,
      parent: form.value.parent,
      icon: imageUrl,
      description: form.value.description,
      order: form.value.order,
    });

    if (!error) {
      notify("success", "", t("category_edited"), 3000);
      router.push({ name: "categories" });
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
