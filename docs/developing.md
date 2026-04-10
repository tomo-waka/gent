# Monorepo Developing Guide

This guide contains monorepo-wide development rules shared across packages.

For package-specific workflows, see:

- [`packages/gent/docs/developing.md`](../packages/gent/docs/developing.md) for `@gent-js/gent`

## Commit Message Convention

- This section is the canonical commit message policy for this repository (for both humans and AI agents).
- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`
- Use the following minimal type set to keep impact clear without over-fragmenting:
  - `feat`: production code change that adds or extends user-visible behavior.
  - `fix`: production code change that fixes incorrect behavior.
  - `refactor`: production code change with no intended behavior change (internal structure, readability, maintainability).
  - `docs`: documentation-only change (for example Markdown files, usage guides).
  - `ci`: CI/CD-only change (for example GitHub Actions workflows, pipeline settings).
  - `style`: non-behavioral formatting/lint-rule application (for example Prettier output, ESLint autofix-only updates).
  - `test`: test-only change (add/update tests with no production code semantics change).
  - `chore`: repository/tooling/config maintenance that is not `ci`, `docs`, `style`, or `test`, and does not change production behavior.
- Rule of thumb:
  - If runtime behavior of production code changes, use `feat` or `fix` (or `refactor` only when behavior is intentionally unchanged).
  - If production behavior does not change, do not use `feat` or `fix`.
- Priority order when multiple non-production types could apply: `ci` > `docs` > `style` > `test` > `chore`.
- Scope should be the package name (for example `gent`, `gent-gui`, `gent-server`) or a relevant sub-area (for example `cli`, `output`, `template`).
- Examples: `feat(gent): add json template option`, `fix(gent-server): handle empty payload`, `ci: cache npm dependencies`, `style(gent): apply eslint --fix`, `docs: update README`

## Lint and Format (Monorepo)

Run lint and format checks from repository root to apply consistent rules across all packages.

```shell
npm run lint
npm run format:check
```

Auto-fix issues:

```shell
npm run lint:fix
npm run format:write
```

Each package also exposes the same script names for targeted runs.

## VS Code Workspace Settings

When updating workspace settings in `.vscode/settings.json`, keep the file organized for readable diffs and easier maintenance.

- Group entries by concern (for example: AI/chat, editor, testing, extension-specific, spell checker)
- Sort keys alphabetically within each group
- Keep comments short and section-level (avoid inline noise)
- Keep shared project behavior in workspace settings; move personal preferences to User Settings when possible
