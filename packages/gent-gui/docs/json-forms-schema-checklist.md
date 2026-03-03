# JSON Forms Schema Authoring Checklist

This checklist is for `gent-gui` (`@jsonforms/*` 3.7 + `ajv` 8).

Use it when defining or evolving JSON Schema for forms.

## 1) Compatibility / Feature Risk Checklist

### ✅ Generally safe and UI-friendly (default renderers)

- Primitive types with constraints:
  - `type: string|number|integer|boolean`
  - `minimum` / `maximum`, `minLength` / `maxLength`, `pattern`
- `enum` (small, clear option sets)
- `format` values commonly supported by Ajv formats (for validation)
- Object and array basics:
  - `properties`, `required`, `items`, `minItems`, `maxItems`
- `oneOf` when each branch is clearly distinguishable (for example by `const` discriminator)

### ⚠️ Validation may work, but default UI often needs help

- Complex combinators: nested `allOf` / `anyOf` / `oneOf`
- Conditional logic: `if` / `then` / `else`
- Advanced object keywords:
  - `patternProperties`, `unevaluatedProperties`, `dependentSchemas`, `propertyNames`
- Advanced array keywords:
  - `contains`, `minContains`, `maxContains`, `unevaluatedItems`
- Deep `$ref` chains that make branch intent hard to read in forms

### Notes

- In `gent-gui`, custom rendering is already used for `format: date-time`.
- Some keywords are primarily validation semantics and do not automatically produce intuitive interaction patterns.

## 2) UI-First Schema Structure Checklist

### ✅ Do

- Add `title` for every user-facing field and branch.
- Add `description` when meaning is not obvious.
- Prefer discriminated union style for alternatives:
  - `oneOf` + branch-level `title`
  - explicit discriminator property (for example `type` with `const` values)
- Keep branch schemas explicit and narrow (`additionalProperties: false` or equivalent policy).
- Use defaults (`default`) only when they are safe and expected.
- Keep enum option counts manageable.

### ❌ Avoid

- Large ambiguous `anyOf` where multiple branches can match at once.
- Overloading one object with too many optional cross-dependent fields.
- Relying only on `if/then/else` for discoverability (users cannot easily predict hidden constraints).
- Deeply nested anonymous schemas without branch titles.

## 3) Practical Modeling Patterns

## Pattern A: Good union UX

- Prefer:
  - `oneOf` branches with branch `title`
  - each branch has `properties.type.const`
- Why:
  - users can select intent first, then see relevant fields.

## Pattern B: Conditional field visibility

- Primary option:
  - Keep validation in schema (`if/then/else`) and add `uischema` rules for visibility/enabling.
- Alternative:
  - Split into explicit `oneOf` branches to make conditions visible by design.

Use the first option when API/schema compatibility is important.
Use the second when form clarity is more important than schema compactness.

## Pattern C: Format-driven input quality

- Primary option:
  - Use `format` + custom renderer (as done for `date-time`) for strong input UX.
- Alternative:
  - Keep default renderer and rely only on validation errors (faster implementation, weaker UX).

## 4) Authoring Workflow Checklist (Recommended)

1. Model schema for validation correctness.
2. Review whether generated UI is understandable without explanation.
3. If not, add one of:
   - explicit branch titles/discriminator
   - `uischema` grouping/order/rules
   - custom renderer for critical formats
4. Validate real profile samples and edge cases.
5. Re-check error messages for non-expert users.

## 5) Team Rule of Thumb

- Schema alone is best for simple forms.
- For medium/complex forms, treat `schema + uischema (+ custom renderer)` as the standard package.
- Optimize for predictability first, then compactness.
