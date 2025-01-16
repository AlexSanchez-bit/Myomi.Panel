<template>
  <div class="p-5">
    <!-- Escritorio: Vista combinada -->
    <div class="hidden lg:flex gap-6">
      <UserForm
        :mode="mode"
        :user_info="user_info"
        :user_id="user_id"
        @added="handleUserAdded"
        @edited="handleUserEdited"
      />
      <PermissionSelector />
    </div>

    <!-- Móvil: Vista con Stepper -->
    <div class="lg:hidden">
      <Steps
        :model="steps"
        :activeIndex="activeStep"
        @update:activeIndex="(e) => (activeStep = e)"
      />
      <div v-if="activeStep === 0">
        <UserForm
          :mode="mode"
          :user_info="user_info"
          :user_id="user_id"
          @added="handleUserAdded"
          @edited="handleUserEdited"
        />
      </div>
      <div v-else-if="activeStep === 1">
        <PermissionSelector />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Steps from "primevue/steps";

import UserForm from "@/components/Users/UserForm.vue";
import PermissionSelector from "@/components/Users/PermissionSelector.vue";

const steps = [{ label: "User Info" }, { label: "Permissions" }];

const activeStep = ref(0);

// Props
defineProps({
  mode: String,
  user_info: Object,
  user_id: String,
});

// Event handlers
function handleUserAdded() {
  console.log("User added");
}

function handleUserEdited() {
  console.log("User edited");
}
</script>
