# Learning Roadmap (Temporary)

This is a temporary personal learning memo for development in `packages/gent-gui`.

Purpose:

- Keep the full learning path visible while working step by step.
- Prioritize learning Vue and Json Forms through real project work.
- Allow disposable/experimental implementation during early phases.

## How to use this memo

- Mark each step as in progress/completed.
- Add short notes under each step (what was learned, what was difficult, what to revisit).
- Keep entries short and practical.

## Progress overview

- [ ] Step 1: Vue fundamentals in real app code
- [ ] Step 2: Json Forms fundamentals (schema + ui schema)
- [ ] Step 3: Vue + Json Forms integration
- [ ] Step 4: Intermediate Json Forms patterns
- [ ] Step 5: Architecture alignment + minimal tests

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

---

## Optional daily log (short)

Date:

- Today’s focus:
- What I built:
- What I understood better:
- What I want to try next:
