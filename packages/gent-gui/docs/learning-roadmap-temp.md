# Learning Roadmap (Temporary)

This is a temporary personal learning memo for development in `packages/gent-gui`.

Purpose:

- Keep the full learning path visible while working step by step.
- Prioritize learning Vue and Json Forms through real project work.
- Allow disposable/experimental implementation during early phases.

## How to use this memo

- Mark each step as in progress/completed.
- For each step, track both implementation output and personal learning checkpoints.
- Keep learning comments in code while learning (even if they are noisier than normal production style).
- Keep entries short and practical.

### Learning-comment policy for this phase

- Add comments more aggressively than usual to explain intent, data flow, and trade-offs.
- Include references in comments when useful (for example, Vue official docs sections).
- After becoming familiar with Vue/Json Forms, remove or reduce tutorial-style comments.

### Reporting format (use this every step)

#### 1) Copilot implementation log

- What changed (files/components/helpers)
- Why this implementation was chosen
- Validation run (build/lint/test)

#### 2) Developer review and learning checkpoints

- What to read in code (specific files)
- What to verify in runtime behavior
- What to explain back in your own words
- What to refactor as a small exercise (optional)

### Continuous learning loop (apply in every step)

1. Implement a first version focused on understandability.
2. Review refactoring checkpoints (readability, reactivity, separation of concerns).
3. Compare 1-2 alternative implementations and explain trade-offs.
4. Apply one small refactor and verify behavior with build/lint.
5. Keep or remove learning comments depending on current understanding.

When reporting each step, include:

- Refactoring checkpoints found
- Alternative implementation options considered
- Which option was selected and why

## Progress overview

- [ ] Step 1: Vue fundamentals in real app code
- [ ] Step 2: Json Forms fundamentals (schema + ui schema)
- [ ] Step 3: Vue + Json Forms integration
- [ ] Step 4: Intermediate Json Forms patterns
- [ ] Step 5: Architecture alignment + minimal tests

## Vue API style decision (for this learning phase)

- Primary style: Composition API.
- SFC syntax: prefer `<script setup lang="ts">`.
- Reason: aligns with current Vue ecosystem patterns, TypeScript ergonomics, and composable-based reuse.
- Rule of use: introduce Options API only when reading legacy examples or explicitly comparing trade-offs.

Reference hints:

- Vue docs: "Essentials > Composition API FAQ"
- Vue docs: "SFC > `<script setup>`"

---

## Step 1 — Vue fundamentals in real app code

### Goal

Learn core Vue development patterns without Json Forms complexity.

### Suggested implementation

- Create a small Profile Playground page/area.
- Practice component split (parent + child components).
- Practice props and emits.
- Practice computed and watch.
- Add one composable for local state persistence.

### Completion criteria

- You can explain when to use props/emits vs shared composable state.
- You can trace data flow across parent/child components.
- You can confidently create and refactor basic Vue components.

### Notes

- Learned:
- Difficulties:
- Revisit later:

### Step review template

#### Copilot implementation log

- What changed:
- Why this way:
- Validation:

#### Developer review and learning checkpoints

- Code reading targets:
- Runtime checks:
- Explain-back checkpoints:
- Optional refactor exercise:

### Step 1 refactoring checklist (practice)

- [x] Replace `watch(() => profile.value, ...)` with `watch(profile, ...)` and confirm behavior is unchanged.
- [x] Remove `deep: true` once, verify timestamp still updates from current immutable updates, then explain why.
- [x] Extract all update handlers into one helper (for example, `patchProfile`) and compare readability before/after.
- [x] Compare `ref<PlaygroundProfile>(...)` vs `reactive(...)` for this page and write a short note about trade-offs.
- [x] Decide whether to keep current style or adopt one of the alternatives, with a one-paragraph reason.

Step 1 alternative implementation ideas:

- Alternative A: keep `ref` + immutable object replacement (current style, explicit update flow).
- Alternative B: switch to `reactive` + direct property mutation (less boilerplate, different watch semantics).
- Alternative C: keep `ref` but use a generic `updateProfile<K extends keyof PlaygroundProfile>(...)` helper.

Step 1 decision note:

- Selected style: Alternative A (`ref` + immutable updates).
- Reason: for early learning, explicit replacement flow makes reactive updates and watcher triggers easier to reason about than mixed in-place mutation patterns.

---

## Step 2 — Json Forms fundamentals

### Goal

Understand schema and ui schema basics with a small standalone form.

### Suggested implementation

- Create a tiny JSON Schema (primitive fields, enum, nested object, simple array).
- Create a matching UI Schema (layout/group/order).
- Render with default Json Forms renderer set.
- Observe how validation errors are produced.

### Completion criteria

- You can explain schema vs ui schema responsibility.
- You can add/update fields without breaking renderer behavior.
- You can predict basic validation outcomes.

### Notes

- Learned:
- Difficulties:
- Revisit later:

### Step review template

#### Copilot implementation log

- What changed:
- Why this way:
- Validation:

#### Developer review and learning checkpoints

- Code reading targets:
- Runtime checks:
- Explain-back checkpoints:
- Optional refactor exercise:

---

## Step 3 — Vue + Json Forms integration

### Goal

Build confidence in practical integration patterns.

### Suggested implementation

- Connect Json Forms data to Vue state management for this feature.
- Add live JSON preview panel.
- Add concise validation error summary panel.
- Confirm update flow from UI input -> data model -> preview.

### Completion criteria

- You can explain the integration data flow end-to-end.
- You can debug basic state-sync issues.
- You can identify where to place integration logic in feature structure.

### Notes

- Learned:
- Difficulties:
- Revisit later:

### Step review template

#### Copilot implementation log

- What changed:
- Why this way:
- Validation:

#### Developer review and learning checkpoints

- Code reading targets:
- Runtime checks:
- Explain-back checkpoints:
- Optional refactor exercise:

---

## Step 4 — Intermediate Json Forms patterns

### Goal

Learn where default rendering is insufficient and how to extend.

### Suggested implementation

- Add one rule-based conditional visibility case.
- Add one custom renderer case (for example, date-time handling improvement).
- Compare default behavior vs customized behavior.

### Completion criteria

- You can choose between schema-only and ui schema/custom renderer approaches.
- You can explain trade-offs in UX and maintenance.

### Notes

- Learned:
- Difficulties:
- Revisit later:

### Step review template

#### Copilot implementation log

- What changed:
- Why this way:
- Validation:

#### Developer review and learning checkpoints

- Code reading targets:
- Runtime checks:
- Explain-back checkpoints:
- Optional refactor exercise:

---

## Step 5 — Architecture alignment and minimal verification

### Goal

Reinforce project architecture habits while keeping learning momentum.

### Suggested implementation

- Align code placement with current structure guidance (core/features/framework).
- Keep root component thin and move feature logic under feature scope.
- Add 1-2 focused tests for stable helper logic where practical.

### Completion criteria

- You can decide where new code should live with confidence.
- You can add small safe tests around helper logic.
- You can keep implementation scoped and readable.

### Notes

- Learned:
- Difficulties:
- Revisit later:

### Step review template

#### Copilot implementation log

- What changed:
- Why this way:
- Validation:

#### Developer review and learning checkpoints

- Code reading targets:
- Runtime checks:
- Explain-back checkpoints:
- Optional refactor exercise:

---

## Optional daily log (short)

Date:

- Today’s focus:
- What I built:
- What I understood better:
- What I want to try next:
