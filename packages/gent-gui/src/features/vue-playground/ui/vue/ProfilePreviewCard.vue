<script setup lang="ts">
// Learning note:
// This component is intentionally "display only" to demonstrate separation
// between presentational components and state-managing container components.
const props = defineProps<{
  progressLabel: string;
  lastChanged: string;
  profileJson: string;
}>();
</script>

<template>
  <section class="panel">
    <h2>Preview</h2>
    <p class="status">Progress: {{ props.progressLabel }}</p>
    <p class="status">Last changed: {{ props.lastChanged }}</p>
    <pre>{{ props.profileJson }}</pre>
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

.status {
  margin-top: 0;
  margin-bottom: 0.5rem;
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
