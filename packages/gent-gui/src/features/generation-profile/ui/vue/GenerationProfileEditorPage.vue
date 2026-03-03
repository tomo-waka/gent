<script setup lang="ts">
import { createAjv } from "@jsonforms/core";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { computed, ref } from "vue";
import { typedGenerationProfileSchema } from "../../../../core/schema/generationProfileSchema";
import {
  applyGenerationProfileFormChange,
  createGenerationProfileEditorState,
  getGenerationProfileIssueCountLabel,
  isGenerationProfileValid,
  toGenerationProfileJson,
} from "../../application/generationProfileEditor";
import { createInitialGenerationProfile } from "../../model/generationProfileModel";

const renderers = Object.freeze(vanillaRenderers);
const ajv = createAjv({ allErrors: true, strict: false });

const state = ref(
  createGenerationProfileEditorState(createInitialGenerationProfile()),
);

const generatedProfile = computed(() =>
  toGenerationProfileJson(state.value.profile),
);
const isValid = computed(() => isGenerationProfileValid(state.value.errors));
const issueCountLabel = computed(() =>
  getGenerationProfileIssueCountLabel(state.value.errors),
);

const handleChange = ({ data, errors }: JsonFormsChangeEvent) => {
  state.value = applyGenerationProfileFormChange(data, errors);
};
</script>

<template>
  <main class="app">
    <header>
      <h1>GenT Profile Builder</h1>
      <p class="lead">
        Fill in the form generated from the GenT generation profile schema.
      </p>
    </header>

    <section class="panel">
      <h2>Profile Inputs</h2>
      <div class="formHost">
        <JsonForms
          :schema="typedGenerationProfileSchema"
          :ajv="ajv"
          :data="state.profile"
          :renderers="renderers"
          @change="handleChange"
        />
      </div>
      <p class="status" :data-valid="isValid">
        Validation: {{ isValid ? "valid" : issueCountLabel }}
      </p>
    </section>

    <section class="panel">
      <h2>Generated generation profile JSON</h2>
      <pre>{{ generatedProfile }}</pre>
    </section>
  </main>
</template>

<style scoped>
.app {
  display: grid;
  gap: 1rem;
}

.lead {
  margin-top: 0.25rem;
  margin-bottom: 0;
  color: #4b5563;
}

.panel {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  background: #ffffff;
}

.panel h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.formHost :deep(input),
.formHost :deep(select),
.formHost :deep(textarea) {
  width: 100%;
  box-sizing: border-box;
}

.status {
  margin-bottom: 0;
}

.status[data-valid="true"] {
  color: #166534;
}

.status[data-valid="false"] {
  color: #991b1b;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #111827;
  color: #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  overflow: auto;
}
</style>
