<template>
  <div class="bg-white">
    <!-- Dropdown que actúa como botón para desplegar el input -->
    <Button
      icon="pi pi-chevron-down"
      @click="toggleDropdown"
      severity="secondary"
      aria-label="Bookmark"
    />

    <!-- Input desplegable -->
    <div
      v-show="dropdown"
      class="absolute z-50 bg-white border flex flex-col p-3"
      ref="inputField"
    >
      <!-- Este es el caso por defecto para cualquier otro tipo -->
      <InputText
        class="px-2 py-1 shadow-lg rounded-md border-solid border"
        type="text"
        autofocus
        v-model="name_filter"
        @update:model-value="changeInput"
      />

      <div class="flex flex-row gap-1 items-center mt-4">
        <Checkbox
          id="anonymous"
          class="shadow-lg rounded-md border-solid"
          type="checkbox"
          binary
          autofocus
          v-model="anonymous"
          @update:model-value="changeInput"
        />

        <label for="anonymous">{{ $t("anonymous_user") }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineModel, type Ref, onMounted } from "vue";
import Button from "primevue/button";
import { nextTick } from "vue";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";

// Definición de props
const emit = defineEmits<{ (e: "reload"): void }>();
const value = defineModel<any>("value");
const matchMode = defineModel<any>("matchMode");

const name_filter = ref(null);

const inputField: Ref<any> = ref(null);
const anonymous: Ref<any> = ref(false);

onMounted(() => {
  if (matchMode.value === "IS") {
    anonymous.value = true;
  } else {
    name_filter.value = value.value[1][2]?.split("%")[1];
  }
});

// Estado local para el dropdown
const dropdown = ref(false);

// Método para alternar el estado del dropdown
const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
  nextTick(() => {
    inputField.value.focus();
  });
};

const lastTiemout = ref(null);

async function changeInput(nv: string | boolean) {
  if (nv === true) {
    matchMode.value = "IS";
    value.value = "null";
  } else {
    matchMode.value = "AND";
    value.value = [
      ["session_id", "is", null],
      ["user.name", "ilike", `%${nv}%`],
    ];
  }

  if (lastTiemout.value) {
    clearTimeout(lastTiemout.value);
  }
  lastTiemout.value = setTimeout(() => {
    emit("reload");
  }, 500);
}

// Exponer el estado y métodos al template
defineExpose({
  dropdown,
  toggleDropdown,
});
</script>
