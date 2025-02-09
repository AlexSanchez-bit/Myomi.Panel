<template>
  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <!-- Icono -->
    <div class="relative w-24 h-24">
      <p class="text-center absolute top-0 left-2">
        {{ $t("icon") }}
      </p>
      <img
        :src="profileImage ?? '/extras/defaultprofile.jpg'"
        alt=""
        class="w-24 h-24 border border-gray-300 object-cover"
      />
      <i
        class="pi pi-upload pi-2x absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-darkblue"
      ></i>
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer w-24 h-24"
        @change="onProfileImageChange"
      />
    </div>

    <!-- Imagen para la web  -->

    <div class="relative w-8/12 h-24 mx-auto">
      <p class="text-center absolute w-full top-1/2 left-2">
        {{ $t("landscape_image") }}
      </p>
      <img
        :src="portraitImage ?? '/extras/defaultprofile.jpg'"
        alt=""
        class="w-full h-24 border border-gray-300 object-cover"
      />
      <i
        class="pi pi-upload pi-2x absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-darkblue"
      ></i>
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        @change="onPortraitImageChange"
      />
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

    <!--Enlace -->
    <div>
      <label for="link" class="block text-sm font-medium">{{
        $t("link")
      }}</label>
      <InputText id="link" v-model="form.brand_link" class="w-full" />
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create'
          ? $t('create') + ' ' + $t('brand')
          : $t('edit') + ' ' + $t('brand')
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
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useBrandService } from "@/composables/Shop/Brand/useBrandService";
import type { IBrand } from "@/services/Shops/Brands/Brand.service";

const { notify } = useToastStorage();
const service = useBrandService();
const router = useRouter();

interface Props {
  mode: "create" | "edit";
  brand_id?: string;
}

const props = defineProps<Props>();
const { mode, brand_id } = props;

// Foto de perfil
const profileImage = ref<string | null>(null);
const profileImageFile = ref<File | null>(null);
const portraitImage = ref<string | null>(null);
const portraitImageFile = ref<File | null>(null);
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

function onPortraitImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    portraitImageFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      portraitImage.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

onMounted(async () => {
  if (mode == "edit") {
    isSubmitting.value = true;
    const { data, error } = await service.getDetails(brand_id!);
    isSubmitting.value = false;
    if (!error) {
      form.value = data;
      profileImage.value = data.icon;
      portraitImage.value = data.layer_image;
    } else {
      notify(
        "error",
        "Hubo un problema buscando la marca",
        error.message,
        3000,
      );
    }
  }
});

// Modelo del formulario

// Estado reactivo para el formulario
const form = ref<Partial<IBrand>>({
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

  let iconUrl = profileImage.value;
  isSubmitting.value = true;
  if (profileImageFile.value) {
    iconUrl = await uploadPublicFile(profileImageFile.value);
    if (!iconUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }

  let portraitUrl = profileImage.value;
  isSubmitting.value = true;
  if (profileImageFile.value) {
    portraitUrl = await uploadPublicFile(portraitImageFile.value);
    if (!portraitUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }

  if (mode == "create") {
    const error = await service.create({
      ...(form.value as IBrand),
      icon: iconUrl,
      layer_image: portraitUrl,
    });

    if (!error) {
      notify("success", "", t("brand") + " " + t("created"), 3000);

      router.push({ name: "brands" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await service.update(brand_id, {
      ...(form.value as IBrand),
      icon: iconUrl,
      layer_image: portraitUrl,
    });

    if (!error) {
      notify("success", "", t("brand") + " " + t("edited"), 3000);
      router.push({ name: "brands" });
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
