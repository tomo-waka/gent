<script setup lang="ts">
import { createAjv, type JsonSchema } from "@jsonforms/core";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import type { ErrorObject } from "ajv";
import { computed, ref } from "vue";
import { generationProfileSchema } from "@gent-js/gent/generated/schema/generatedGenerationProfileSchema";
import { initialGenerationProfile } from "./schema/initialGenerationProfile";

const profile = ref<Record<string, unknown>>(
  structuredClone(initialGenerationProfile),
);
const errors = ref<ErrorObject[]>([]);

const ajv = createAjv({ allErrors: true, strict: false });
const schema = generationProfileSchema as JsonSchema;

const generatedProfile = computed(() => JSON.stringify(profile.value, null, 2));

const isValid = computed(() => errors.value.length === 0);
const issueCountLabel = computed(() => `${errors.value.length} issue(s)`);

const handleChange = ({ data, errors: nextErrors }: JsonFormsChangeEvent) => {
  profile.value = (data ?? {}) as Record<string, unknown>;
  errors.value = (nextErrors ?? []) as ErrorObject[];
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
          :ajv="ajv"
          :data="profile"
          :renderers="vanillaRenderers"
          :schema="schema"
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
