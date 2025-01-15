<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useToastStorage } from "./stores/ToasterStorage";
import { useToast } from "primevue/usetoast";
import { useSplashStore } from "@/stores/SplashScreen";
import SplashScreen from "./components/SplashScreen.vue";
const toastStorage = useToastStorage();
const toast = useToast();
toastStorage.addtoaster(toast);
const { active } = useSplashStore();
</script>

<template>
  <SplashScreen v-if="active" />
  <RouterView />
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
