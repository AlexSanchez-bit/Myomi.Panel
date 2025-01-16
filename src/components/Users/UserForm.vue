<template>
  <div class="rounded-lg overflow-hidden relative">
    <!-- Loading Spinner -->
    <div
      class="absolute w-full h-full flex justify-center items-center z-10"
      v-if="loading"
    >
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>

    <!-- Header -->
    <header
      class="bg-darkblue text-wood font-albra-serif-bold py-5 text-3xl rounded-t-lg text-center px-4"
    >
      <h1>
        {{ mode === "create" ? $t("user_creation") : $t("user_edition") }}
      </h1>
    </header>

    <!-- Form -->
    <div class="flex flex-col gap-6 p-5 px-11 bg- items-center text-brick">
      <!-- Name -->
      <FloatLabel class="flex-1">
        <InputText
          id="username"
          class="flex-1"
          v-model="name.value"
          :invalid="!name.validity && name.touched"
          @click="name.touched = true"
          @input="name.touched = true"
        />
        <label for="username">{{ $t("name") }}</label>
      </FloatLabel>

      <!-- Last Name -->
      <FloatLabel class="flex-1">
        <InputText
          id="last_name"
          class="flex-1"
          v-model="last_name.value"
          :invalid="!last_name.validity && last_name.touched"
          @click="last_name.touched = true"
          @input="last_name.touched = true"
        />
        <label for="last_name">{{ $t("last_name") }}</label>
      </FloatLabel>

      <!-- Email -->
      <FloatLabel class="flex-1">
        <InputText
          id="email"
          class="flex-1"
          v-model="email.value"
          :invalid="!email.validity && email.touched"
          @click="email.touched = true"
          @input="email.touched = true"
        />
        <label for="email">{{ $t("email") }}</label>
      </FloatLabel>

      <!-- Password Fields (Only for Create Mode) -->
      <div v-if="mode === 'create'">
        <FloatLabel class="flex-1">
          <InputText
            id="passw"
            class="flex-1"
            v-model="password.value"
            :invalid="!password.validity && password.touched"
            @click="password.touched = true"
            @input="password.touched = true"
          />
          <label for="passw">{{ $t("password") }}</label>
        </FloatLabel>

        <FloatLabel class="flex-1">
          <InputText
            id="passwC"
            class="flex-1"
            v-model="password_confirm.value"
            :invalid="!password_confirm.validity && password_confirm.touched"
            @click="password_confirm.touched = true"
            @input="password_confirm.touched = true"
          />
          <label for="passwC">{{ $t("password_confirm") }}</label>
        </FloatLabel>

        <small
          class="text-xs text-red-500"
          v-if="
            !password_confirm.validity &&
            (password_confirm.touched || password.touched)
          "
        >
          {{ $t("passwords_dont_match") }}
        </small>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-row gap-5">
        <Button
          severity="primary"
          :disabled="!formValid"
          :icon="mode === 'create' ? 'pi pi-check' : 'pi pi-pencil'"
          :label="mode === 'create' ? $t('create') : $t('edit')"
          @click="handleSubmit"
        />
        <Button severity="secondary" :label="$t('cancel')" @click="closeCb" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref, onMounted } from "vue";
import { useUserForm } from "@/composables/Users/useUserForm";
import { useUserService } from "@/composables/Users/useUserService";
import { type UserData } from "@/utils/Users/UserData";

interface Props {
  mode: "create" | "edit";
  user_info?: UserData;
  user_id?: string;
}

const props = defineProps<Props>();
const { mode, user_id } = props;

const { name, last_name, email, password, password_confirm } = useUserForm();

const { userService } = useUserService();
const emit = defineEmits<{ (e: "added" | "edited"): void }>();
const loading = ref(false);

const formValid = ref(false);

onMounted(async () => {
  loading.value = true;
  const { data, error } = await userService.getUserData(user_id);
  loading.value = false;
  console.log(data, error);
});

// Compute form validity dynamically
formValid.value =
  name.validity &&
  last_name.validity &&
  email.validity &&
  (mode === "edit" || (password.validity && password_confirm.validity));

async function handleSubmit() {
  loading.value = true;

  if (mode === "create") {
    const data = await userService.createUser(
      name.value,
      email.value,
      password.value,
    );
    loading.value = false;
    if (data) {
      emit("added");
      closeCb();
    }
  } else {
    const error = await userService.editUser(
      user_info!.id,
      name.value,
      last_name.value,
      email.value,
    );
    loading.value = false;
    if (!error) {
      emit("edited");
      closeCb();
    }
  }
}

onMounted(async () => {});
</script>

<style>
/* Override PrimeVue button styles */
.p-button.p-button-primary {
  background-color: var(--primary-color-grass) !important;
  border-color: var(--primary-color-sea) !important;
  color: var(--primary-color-wood) !important;
}

.p-button.p-button-secondary {
  background-color: var(--secondary-color-darkblue) !important;
  border-color: var(--secondary-color-darkblue) !important;
  color: var(--secondary-color-darkblue) !important;
}
</style>
