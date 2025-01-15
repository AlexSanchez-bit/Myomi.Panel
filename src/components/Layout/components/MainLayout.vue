<template>
  <Dialog
    v-model:visible="passchange"
    modal
    header="Cambiar Contraseña"
    :style="{ width: '25rem' }"
  >
  </Dialog>
  <div class="flex flex-row w-full">
    <div
      @mouseleave="toggle_panel(true)"
      @mouseenter="toggle_panel(false)"
      v-bind:class="{
        closed: !visible && !static_pane,
        'w-72': static_pane || visible,
        'slide-bar': !static_pane,
      }"
      class="hover:w-72 sticky drop-shadow-md top-0 slide-bar-container z-40 left-0 w-16 p-3 pr-0 h-screen overflow-auto bg-darkblue text-wood"
    >
      <div class="flex flex-col gap-12">
        <section
          v-bind:class="{ 'slide-header-visible': visible || static_pane }"
          class="flex flex-row slide-header items-center pr-3"
        >
          <img
            @click="toggle_panel(false)"
            class="logo-button cursor:pointer"
            src="/logo/logo_arena.png"
            alt=" logo"
            :class="{ 'logo-button-active': static_pane }"
          />
          <h1
            v-bind:class="{ 'slide-text-active': visible || static_pane }"
            class="text-wood text-sm truncate slide-text uppercase tracking-widest"
          >
            c a s a p r i m a
          </h1>

          <div
            v-show="visible || static_pane"
            class="flex text-wood flex-col place-items-center transition-transform"
            @click="toggle_static_pane"
            :class="static_pane ? [] : ['rotate-45']"
          >
            <div class="w-2 h-1 bg-wood rounded-b-full -mb-0.5" />
            <div class="rounded-full w-1 h-2 bg-wood" />
            <div class="w-2 h-1 bg-wood rounded-t-full -mt-0.5" />
            <div class="w-0.5 h-2 bg-wood" />
          </div>
          <!-- <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer" v-tooltip.bottom="{
            value: 'crear usuario',
            showDelay: 100,
            hideDelay: 300,
          }" :class="{ 'slide-button-active': visible || static_pane, 'hidden': !visible && !static_pane }" id="a"
            @click="toggle_static_pane" viewBox="0 0 800 600.7" :fill="(static_pane) ? '#00ffaa' : '#00009f'">
            <path
              d="M298.03,445.17c-3.94-11.99-25.02-18.66-38.29-14.31,1.18,1.58,2.16,3.13,3.37,4.49,15.75,17.74,35.41,27.48,59.1,29.68,18.01,1.67,30.5-6.01,39.47-20.95,5.66-9.43,8.54-19.81,9.94-30.53,2.61-20.02,5.4-40.06,6.99-60.17,2.29-28.94,3.67-57.95,5.23-86.94,.81-15.14,1.18-30.3,1.73-45.45,.05-1.37,0-2.74,0-4.47-4.61-.34-9.14-.48-13.61-1.05-14.58-1.85-29.13-3.88-43.71-5.77-2.31-.3-3.09-1.17-3.05-3.62,.16-10.17,.07-20.34,.07-31.37,20.46-2.08,40.84-4.16,62.07-6.33,0-3.7,.1-8.02-.11-12.32-.03-.66-1.44-1.53-2.37-1.84-17.81-5.96-29.16-17.95-33.28-36.29-2.29-10.18-.84-20.21,3.18-29.84,.89-2.13,1.98-4.19,3.07-6.48-4.62-2.31-7.54-5.72-7.38-11.14,.15-5.26,2.95-8.86,7.24-11.58-1.33-2.8-2.4-5.8,.19-7.95,1.06-.89,3.48-.15,5.26-.15,.28-2.18,.29-4.97,1.05-7.53,1.62-5.41,6.89-8.6,12.3-7.88,7.59,1.02,11.24,9.82,6.81,16.43-2.42,3.62-5.89,5.68-10.76,6.76,4.2,2.08,7,4.62,12.15,2.92,32.36-10.7,65.06,14.86,63.49,49.26-.89,19.59-14.27,37.17-33,43.14-2.05,.65-2.89,1.41-2.75,3.68,.24,3.68,.06,7.38,.06,10.77,21.07,2.06,41.46,4.06,62,6.07v34.56c-19.69,3.92-39.66,6.54-59.56,7.55,0,5.65-.19,10.94,.03,16.21,1.01,24.05,1.88,48.1,3.31,72.12,1.32,22.2,2.85,44.41,5.11,66.54,1.85,18.08,4.36,36.13,7.64,54,2.29,12.48,8.34,23.51,18.39,31.84,8.31,6.89,17.89,8.8,28.52,7.79,16.06-1.53,30.89-6.36,43.71-16.14,6.26-4.78,11.6-10.78,17.33-16.25,.43-.41,.66-1.04,.99-1.58-13.08-5.03-31.26,1.96-37.42,14.27-2.36-4.49-.75-14.52,5.42-20.33,4.32-4.07,8.59-8.2,12.97-12.2,17.5-15.98,30.54-35.04,39.39-56.99,.38-.95,.83-1.86,1.41-3.17,4.48,7.16,7.27,14.66,9.62,22.32,5.09,16.53,7.56,33.45,6.43,50.76-.98,14.93-5.95,28.27-16.76,39.05-.49,.49-1.04,.92-1.82,1.62,.46-12.98-2.28-24.2-13.13-32.41-10.38,30.37-31.06,51.82-56.41,69.43-19.39,13.47-40.59,23.27-62.9,30.83-10.1,3.42-19.67,7.85-26.81,16.54-8.35-10.05-19.94-14.37-31.67-18.44-27.72-9.6-53.33-22.99-75.67-42.22-14.95-12.87-27.33-27.74-35.11-46.08-1.31-3.08-2.23-6.33-3.47-9.88-10.15,8.23-13.38,19.09-13.48,32.03-2.58-3.06-5.41-5.95-7.69-9.23-6.73-9.68-9.44-20.76-9.92-32.32-1.02-24.56,3.86-47.92,15.11-69.87,.24-.47,.53-.91,.94-1.61,.36,.52,.71,.85,.86,1.26,8.76,23,22.63,42.49,40.56,59.22,4.8,4.48,9.64,8.95,14.02,13.82,4.57,5.09,4.74,11.37,3.58,17.72Zm79.33-305.54c-3.64-12.72-.58-23.56,8.23-29.89,8.21-5.9,19.62-5.85,28.29,.13,8.79,6.06,11.24,15.49,7.66,29.54,10.51-6.41,18.53-22.59,14.95-38.6-3.59-16.01-19.25-29.8-34.6-30.47-17.63-.77-33.41,10.41-38.72,27.44-4.75,15.21,1.45,33.79,14.19,41.86Zm-6.42-71.87c-2.16-1.1-4.42-1.96-6.34-3.29-1.71-1.19-3.05-.97-4.61,.02-4.19,2.67-6.13,9.54,.44,12.61,3.55-3.16,7.06-6.28,10.51-9.34Zm-.79-14.53c2.79-1.36,5.44-2.21,7.53-3.8,2.71-2.05,2.74-5.88,.56-7.75-2.29-1.96-5.68-1.42-7.77,1.32-2.25,2.95-1.61,6.12-.32,10.22Z" />
            <path
              d="M322.25,191.49c0,4.88-.11,9.76,.06,14.63,.07,2-.48,3.22-2.38,3.85-.69,.23-1.42,.54-1.97,1-4.66,3.89-8.97,2.27-13.22-.74-7.29-5.16-11.37-12.01-10.34-21.1,1.14-10,6.85-16.6,16.32-19.88,.94-.33,2.25,0,3.27,.35,6.48,2.25,10.17,6.1,8.35,13.64-.63,2.61-.1,5.49-.1,8.25Z" />
            <path
              d="M477.48,191.54c0-5.08-.08-10.17,.07-15.25,.03-1.02,.76-2.19,1.5-2.98,.77-.82,2.02-1.15,2.92-1.87,4.51-3.59,8.75-2.38,12.97,.57,7.96,5.56,11.59,13.27,10.16,22.75-1.43,9.44-7.76,15.25-16.46,18.42-1.25,.46-3.12-.72-4.69-1.18-5.05-1.47-7.29-4.46-6.31-10,.6-3.39,.11-6.97,.11-10.47h-.27Z" />
          </svg> -->
        </section>

        <div class="divide-y-2 divide-gray-600 divide-dashed mr-3">
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
    <div class="min-h-screen w-full pl-14" :class="{ 'pl-72': static_pane }">
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
  position: fixed;
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
  justify-content: center;
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
  width: 30px;
  height: 30px;
}

.slide-bar:hover .logo-button {
  width: 25px;
  height: 25px;
  transition: all 0.3s ease-out;
}

.logo-button-active {
  width: 25px;
  height: 25px;
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
