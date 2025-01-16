<template>
  <Dialog
    v-model:visible="passchange"
    modal
    header="Cambiar Contraseña"
    :style="{ width: '25rem' }"
  >
  </Dialog>
  <div class="flex-row w-full flex">
    <div
      @mouseleave="toggle_panel(true)"
      @mouseenter="toggle_panel(false)"
      v-bind:class="{
        closed: !visible && !static_pane,
        'w-72': static_pane || visible,
        'slide-bar': !static_pane,
      }"
      class="hidden md:block hover:w-72 sticky drop-shadow-md top-0 slide-bar-container z-40 left-0 w-16 p-3 pr-0 h-screen overflow-auto bg-darkblue text-wood"
    >
      <div class="flex flex-col">
        <div
          class="w-full flex flex-row justify-end pr-4"
          v-show="visible || static_pane"
        >
          <div
            class="flex text-wood flex-col place-items-center transition-transform"
            @click="toggle_static_pane"
            :class="static_pane ? [] : ['rotate-45']"
          >
            <div class="w-2 h-1 bg-wood rounded-b-full -mb-0.5" />
            <div class="rounded-full w-1 h-2 bg-wood" />
            <div class="w-2 h-1 bg-wood rounded-t-full -mt-0.5" />
            <div class="w-0.5 h-2 bg-wood" />
          </div>
        </div>
        <section
          v-bind:class="{ 'slide-header-visible': visible || static_pane }"
          class="flex flex-row slide-header justify-center items-center pr-3"
        >
          <picture
            class="logo-button rounded-full overflow-hidden bg-white"
            :class="{ 'logo-button-active': static_pane }"
          >
            <img
              @click="toggle_panel(false)"
              class="cursor:pointer w-full h-full"
              src="/logo/logo.png"
              alt=" logo"
            />
          </picture>
        </section>

        <div class="divide-y-2 divide-gray-50 divide-dashed mr-3">
          <section
            class="flex flex-col gap-1 slide-text mt-12 mb-12"
            :class="{ 'slide-text-active': static_pane }"
          >
            <h3 class="text-lg truncate text-wood text-center">
              {{ authService.userData.user_name }}
              {{ authService.userData.last_name }}
            </h3>
            <h4 class="text-md truncate text-wood text-center">
              {{ authService.userData.user.email }}
            </h4>
          </section>
          <StaticMenu
            class="slide-text"
            :menuItems="groups"
            :class="{ 'slide-text-active': static_pane }"
          />
        </div>
      </div>
    </div>
    <div class="min-h-screen w-full md:pl-14" :class="{ 'pl-72': static_pane }">
      <div
        class="flex flex-row mb-3 p-2 border-gray-200 border rounded-lg gap-4 flex-1 justify-end"
      >
        <Menubar class="border-none" breakpoint="100px" :model="items" />
        <LanguageSelector />
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelector from "../../LanguageSelector.vue";
import StaticMenu from "./StaticMenu.vue";
import { MenuList } from "../entities/MenuList";
import { ref, provide, computed } from "vue";
import Menubar from "primevue/menubar";
import Dialog from "primevue/dialog";

const groups = MenuList;

const visible = ref(false);

import { useAuthStore } from "@/stores/AuthStore";

const authService = useAuthStore();
const passchange = ref(false);
const static_pane = ref(false);

const toggle_static_pane = () => {
  static_pane.value = !static_pane.value;
};

const toggle_panel = (activation_param: boolean) => {
  if (visible.value == activation_param && !static_pane.value) {
    visible.value = !visible.value;
  }
};

const userName = computed<string>(() => {
  return authService.userData.user.email;
});

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const items = ref([
  {
    label: userName,
    icon: "",
    items: [
      {
        label: computed(() => t("logout")),
        icon: "pi pi-sign-out",
        command: () => {
          authService.logout();
        },
      },
    ],
  },
]);

const activePanel = computed<boolean>(() => {
  return visible.value || static_pane.value;
});

provide("activatedPanel", activePanel);
</script>

<style scoped>
.slide-bar-container {
  position: sticky;
  top: 0;
  transition: all 0.1s ease-out 0.05s;
}

:deep .p-menubar ul {
  float: left;
  /* Ajusta la posición del menú a la izquierda */
  margin-right: 20px;
}

.slide-text {
  width: 0;
  transition: width 0.3s ease-out;
}

.slide-button {
  display: none;
}

.slide-bar:hover .slide-button {
  display: block;
}

.slide-button-active {
  display: block;
}

.slide-header {
  transition: all 0.3s ease-out;
}

.slide-bar:hover .slide-header {
  justify-content: between;
  gap: 30px;
}

.slide-header-visible {
  justify-content: between;
  gap: 30px;
}

.logo-button {
  height: 50px;
  width: 50px;
}
.slide-bar:hover .slide-header {
  padding-right: 29px;
}
.slide-bar:hover .logo-button {
  width: 9rem;
  height: 9rem;
  transition: all 0.3s ease-out;
}

.logo-button-active {
  width: 9rem;
  height: 9rem;
  transition: all 0.3s ease-out;
}

.slide-bar:hover .slide-text {
  width: auto;
}

.slide-text-active {
  width: auto;
}

.slide-button-visible {
  width: 25px;
  height: 25px;
  transition: all 0.3s ease-out;
}

.slide-bar:hover {
  width: 17rem;
}

.slide-bar:hover .oppened {
  width: 17rem;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.slide-bar-container::-webkit-scrollbar {
  display: none;
}
</style>
