<template>
  <div
    v-if="loading"
    class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center z-20"
  >
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="var(--primary-color-brick)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
  </div>

  <div class="flex flex-row gap-4">
    <Button
      v-tooltip="$t('remove_user')"
      icon="pi pi-trash"
      severity="danger"
      rounded
      aria-label="Cancel"
      @click="confirmDelete"
    />
    <router-link :to="{ name: 'users.edit', params: { id: user_data.id } }">
      <Button
        v-tooltip="$t('edit_user')"
        icon="pi pi-pencil"
        severity="help"
        rounded
        aria-label="Favorite"
        @click="edit_visible = true"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import { type UserData } from "@/utils/Users/UserData";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import EditUser from "@/components/Users/EditUser.vue";

import { ref } from "vue";
import { useUserService } from "@/composables/Users/useUserService";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const confirm = useConfirm();

const { userService } = useUserService();

const emit = defineEmits<{
  (e: "edited");
  (e: "removed");
}>();

interface Props {
  user_data: UserData;
}
const props = defineProps<Props>();
const edit_visible = ref(false);
const { user_data } = props;

function edited() {
  emit("edited");
}

const loading = ref(false);

const confirmDelete = () => {
  confirm.require({
    message: t("are_you_shure_to_delete"),
    header: "",
    icon: "pi pi-info-circle",
    rejectLabel: t("Cancel"),
    acceptLabel: t("Delete"),
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      loading.value = true;
      const error = await userService.deleteUser(user_data.id);
      loading.value = false;
      if (!error) {
        emit("removed");
      }
    },
    reject: () => {},
  });
};
</script>

<style>
.p-button.p-button-help {
  background-color: var(--primary-color-grass) !important;
  border-color: var(--primary-color-sea) !important;
  color: var(--primary-color-wood) !important;
}
</style>
