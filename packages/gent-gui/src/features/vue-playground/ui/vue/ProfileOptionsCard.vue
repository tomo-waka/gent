<script setup lang="ts">
import { getCheckboxChecked, getTextInputValue } from "./eventValue";

// Learning note:
// Child components should stay presentational and communicate via props/events.
// This keeps parent as the single source of truth for state.
const props = defineProps<{
  includeTimestamp: boolean;
  tagsInput: string;
}>();

const emit = defineEmits<{
  "update:include-timestamp": [value: boolean];
  "update:tags-input": [value: string];
}>();

// Learning note:
// Checkbox value comes from `checked`, not `value`.
const handleTimestampInput = (event: Event): void => {
  const nextValue = getCheckboxChecked(event);
  emit("update:include-timestamp", nextValue);
};

const handleTagsInput = (event: Event): void => {
  const nextValue = getTextInputValue(event);
  emit("update:tags-input", nextValue);
};
</script>

<template>
  <section class="panel">
    <h2>Options</h2>

    <label class="toggle">
      <input
        :checked="props.includeTimestamp"
        type="checkbox"
        @change="handleTimestampInput"
      />
      <span>Include timestamp</span>
    </label>

    <label class="field">
      <span>Tags (comma separated)</span>
      <input
        :value="props.tagsInput"
        type="text"
        placeholder="release, urgent"
        @input="handleTagsInput"
      />
    </label>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  background: #ffffff;
}

h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.toggle {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.field {
  display: grid;
  gap: 0.375rem;
}

input[type="text"] {
  width: 100%;
  box-sizing: border-box;
}
</style>
