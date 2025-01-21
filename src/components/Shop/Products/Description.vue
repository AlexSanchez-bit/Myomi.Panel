<template>
  <form class="space-y-4 mb-4">
    <div class="w-full">
      <label for="short_description" class="block text-sm font-medium">{{
        $t("short_description")
      }}</label>
      <Textarea
        id="short_description"
        v-model="short_description"
        class="w-full"
        rows="5"
      />
    </div>
    <div>
      <label for="long_description" class="block text-sm font-medium">{{
        $t("long_description")
      }}</label>
      <TinyMce
        id="long_description"
        :value="long_description"
        menubar="format"
        @input="long_description = $event"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import TinyMce from "@/components/Tinymce/index.vue";
import Textarea from "primevue/textarea";
const short_description = defineModel<string>("short_description");
const long_description = defineModel<string>("long_description");
</script>
