<template>
  <Button
    type="button"
    class="bg-transparent text-darkblue border-none"
    @click="toggle"
    aria-haspopup="true"
    aria-controls="overlay_menu"
  >
    <img :src="'/' + language + '.svg'" class="w-6 h-5" alt="" />
    {{ translatedLang }}
  </Button>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
    <template #item="{ item }">
      <span class="flex flex-row gap-2 items-center">
        <img :src="'/' + item.icon + '.svg'" class="w-6 h-5" alt="" />
        {{ translateLang(item!.icon!) }}
      </span>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import Menu from "primevue/menu";
import Button from "primevue/button";
import { i18n } from "@/setup";
import { ref, watch, computed } from "vue";

const menu = ref();
const items = ref([
  {
    items: [
      {
        label: "Español",
        icon: "es",
        command: () => {
          language.value = "es";
          changeLocale("es");
        },
      },
      {
        label: "English",
        icon: "en",
        command: () => {
          language.value = "en";
          changeLocale("en");
        },
      },
      {
        label: "Deutsch",
        icon: "du",
        command: () => {
          language.value = "du";
          changeLocale("du");
        },
      },
    ],
  },
]);

const toggle = (event: any) => {
  menu.value.toggle(event);
};

const language = ref<"es" | "en" | "du">("es");

language.value = i18n.global.locale.value;

const languages = ["es", "en", "du"];

const translatedLang = computed<string>(() => {
  return translateLang(language.value);
});

function translateLang(lang: string): string {
  switch (lang) {
    case "en":
      return "English";
    case "es":
      return "Español";
    case "du":
      return "Deutsch";
  }

  return "English";
}

watch(language, (_old, _new) => {
  changeLocale(_old);
});

const changeLocale = (locale: "en" | "es" | "du") => {
  i18n.global.locale.value = locale;
};

const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
</script>
