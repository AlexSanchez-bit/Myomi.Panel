<template>
  <div>
    <div>
      <h3>{{ $t("carousel-images") }}</h3>
      <ImageSelector
        v-model:images="form.carousell_images"
        v-slot="{ src: image }"
        ref="carousellImages"
      >
        <Image :src="image" alt="Image" preview height="250px" />
      </ImageSelector>
    </div>

    <div class="relative w-10/12 h-96 mx-auto mt-8">
      <p class="text-center absolute w-full top-1/2 left-2">
        {{ $t("promotional_image") }}
      </p>
      <img
        :src="portraitImage ?? '/extras/defaultprofile.jpg'"
        alt=""
        class="w-full h-full border border-gray-300 object-cover"
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
    <Button
      :loading="loading"
      class="w-full mt-10"
      :label="$t('save')"
      @click="saveConfigs"
    />
  </div>
</template>

<script setup lang="ts">
import ImageSelector from "@/components/ImageSelector.vue";
import { useGeneralConfigService } from "@/composables/GeneralConfig/useGeneralConfigService";
import uploadPublicFile from "@/composables/uploadPublicFile";
import type { IGeneralConfig } from "@/services/General-Configs/GeneralConfigs.service";
import { useToastStorage } from "@/stores/ToasterStorage";
import { Pagination } from "@/utils/entities/Pagination";
import Button from "primevue/button";
import Image from "primevue/image";
import { onMounted, reactive, ref } from "vue";

const loading = ref(false);

const service = useGeneralConfigService();
const carousellImages = ref();

const form = reactive<Partial<IGeneralConfig>>({});
const { notify } = useToastStorage();

onMounted(async () => {
  loading.value = true;
  const resp = await service.getAll([], new Pagination(0, 1), []);
  loading.value = false;
  if (resp.length > 0) {
    const config = resp[0];
    form.carousell_images = config.carousell_images;
    form.promotional_image = config.promotional_image;
    config_id.value = config.id;
    portraitImage.value = config.promotional_image;
  }
});

const portraitImage = ref<string | null>(null);
const portraitImageFile = ref<File | null>(null);
const config_id = ref();

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

async function uploadPortrait() {
  let portraitUrl = portraitImage.value;
  if (portraitImageFile.value) {
    portraitUrl = await uploadPublicFile(portraitImageFile.value);
    if (!portraitUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      return;
    }
  }
  return portraitUrl;
}

const saveConfigs = async () => {
  loading.value = true;
  const pictureUrl = await carousellImages.value.uploadImages();
  form.carousell_images = pictureUrl;
  loading.value = false;
  loading.value = true;
  const resp = await uploadPortrait();
  form.promotional_image = resp;
  loading.value = false;
  loading.value = true;
  const error = await service.update(config_id.value, { ...form });
  loading.value = false;
  console.log(error);
};
</script>
