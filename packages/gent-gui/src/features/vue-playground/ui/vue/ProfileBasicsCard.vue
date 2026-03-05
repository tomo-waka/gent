<script setup lang="ts">
import type { PlaygroundTone } from "../../model/playgroundProfileModel";
import { getSelectValue, getTextInputValue } from "./eventValue";

// Learning note:
// defineProps exposes read-only inputs from parent.
// Vue docs reference: "Components > Props".
const props = defineProps<{
  title: string;
  tone: PlaygroundTone;
}>();

// Learning note:
// defineEmits declares the outbound events this component can send.
// Vue docs reference: "Components > Events".
const emit = defineEmits<{
  "update:title": [value: string];
  "update:tone": [value: PlaygroundTone];
}>();

// Learning note:
// Local handler extracts raw DOM value and emits a typed component event.
const handleTitleInput = (event: Event): void => {
  const nextValue = getTextInputValue(event);
  emit("update:title", nextValue);
};

const handleToneInput = (event: Event): void => {
  const nextValue = getSelectValue(event) as PlaygroundTone;
  emit("update:tone", nextValue);
};
</script>

<template>
  <section class="panel">
    <h2>Basics</h2>

    <label class="field">
      <span>Title</span>
      <input
        :value="props.title"
        type="text"
        placeholder="Weekly report"
        @input="handleTitleInput"
      />
    </label>

    <label class="field">
      <span>Tone</span>
      <select :value="props.tone" @change="handleToneInput">
        <option value="formal">Formal</option>
        <option value="casual">Casual</option>
      </select>
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

.field {
  display: grid;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.field:last-child {
  margin-bottom: 0;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
}
</style>
