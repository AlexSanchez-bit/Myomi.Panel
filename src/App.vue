<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useToastStorage } from "./stores/ToasterStorage";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "./stores/AuthStore";
import { supabase } from "./setup";
import { onMounted } from "vue";
const toastStorage = useToastStorage();
const toast = useToast();
toastStorage.addtoaster(toast);
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const resp = await supabase.auth.refreshSession();
  if (resp.error) {
    router.push("/auth/login");
  }
});
</script>

<template>
  <RouterView />
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
