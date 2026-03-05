<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  getPlaygroundProgress,
  toPlaygroundProfileJson,
  toTagInput,
  toTagList,
} from "../../application/playgroundProfileEditor";
import {
  createInitialPlaygroundProfile,
  type PlaygroundProfile,
} from "../../model/playgroundProfileModel";
import ProfileBasicsCard from "./ProfileBasicsCard.vue";
import ProfileOptionsCard from "./ProfileOptionsCard.vue";
import ProfilePreviewCard from "./ProfilePreviewCard.vue";
import { usePersistentState } from "./usePersistentState";

// Learning note:
// Keep feature state in the parent container and pass it down via props/events.
// Vue docs reference: "Components > Props" and "Components > Events".
const profile = usePersistentState(
  "gent-gui.step1.playground-profile",
  createInitialPlaygroundProfile,
);
const lastChanged = ref("none");

// Learning note:
// computed() is used for values derived from state without mutating the source.
// Vue docs reference: "Essentials > Computed".
const progress = computed(() => getPlaygroundProgress(profile.value));
const progressLabel = computed(
  () => `${progress.value.completed}/${progress.value.total} completed`,
);
const profileJson = computed(() => toPlaygroundProfileJson(profile.value));
const tagsInput = computed(() => toTagInput(profile.value.tags));

// Learning note:
// watch() reacts to state changes and is useful for side effects.
// Here, we update UI metadata only (lastChanged), not business state.
// We watch the ref directly (`watch(profile, ...)`) for simpler readability.
// Vue docs reference: "Essentials > Watchers".
watch(profile, () => {
  lastChanged.value = new Date().toLocaleTimeString();
});

// Learning note:
// These handlers use immutable updates (object spread) so the update intent
// is explicit and easy to trace while learning state flow.
// Alternative style to compare: `reactive()` + direct property mutation.
const patchProfile = (patch: Partial<PlaygroundProfile>): void => {
  profile.value = {
    ...profile.value,
    ...patch,
  };
};

const updateTitle = (title: string): void => {
  patchProfile({ title });
};

const updateTone = (tone: "formal" | "casual"): void => {
  patchProfile({ tone });
};

const updateIncludeTimestamp = (includeTimestamp: boolean): void => {
  patchProfile({ includeTimestamp });
};

const updateTagsInput = (tagInput: string): void => {
  patchProfile({ tags: toTagList(tagInput) });
};
</script>

<template>
  <main class="app">
    <header>
      <h1>Vue Learning Playground (Step 1)</h1>
      <p class="lead">
        Practice component split, props/emits, computed/watch, and composables.
      </p>
    </header>

    <div class="layout">
      <ProfileBasicsCard
        :title="profile.title"
        :tone="profile.tone"
        @update:title="updateTitle"
        @update:tone="updateTone"
      />

      <ProfileOptionsCard
        :include-timestamp="profile.includeTimestamp"
        :tags-input="tagsInput"
        @update:include-timestamp="updateIncludeTimestamp"
        @update:tags-input="updateTagsInput"
      />
    </div>

    <ProfilePreviewCard
      :progress-label="progressLabel"
      :last-changed="lastChanged"
      :profile-json="profileJson"
    />
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

.layout {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
