<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useToastStorage } from "./stores/ToasterStorage";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "./stores/AuthStore";
const toastStorage = useToastStorage();
const toast = useToast();
toastStorage.addtoaster(toast);
const authStore = useAuthStore();
</script>

<template>
  <RouterView />
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
