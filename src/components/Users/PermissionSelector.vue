<template>
  <div class="card">
    <FloatLabel variant="on">
      <label for="multiple-ac-1" class="font-bold mb-2 block"
        >With Typeahead</label
      >
      <AutoComplete
        v-model="value1"
        inputId="multiple-ac-1"
        multiple
        fluid
        :suggestions="items"
        @complete="search"
      />
    </FloatLabel>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import AutoComplete from "primevue/autocomplete";
import FloatLabel from "primevue/floatlabel";

const value1 = ref(null);
const value2 = ref(null);
const items = ref([]);

const search = (event) => {
  items.value = [...Array(10).keys()].map((item) => event.query + "-" + item);
};
</script>
