# Copilot Instructions for GenT

## Goal

These instructions align AI-assisted changes with the current GenT architecture and team workflow.
Default behavior should be: small, scoped edits; explicit validation; and synchronized documentation.

## Scope and Package Boundaries

- Core implementation is `packages/gent` (core + CLI). It contains the project's primary functionality, including the CLI implementation.
- Workspace also contains:
  - `packages/gent-gui` (Vite + React UI). This package is under development and aims to provide a GUI for GenT, using `packages/gent-server` as its backend.
  - `packages/gent-server` (Fastify service). This package is under development and aims to provide a REST API for GenT functionality.
  - `packages/gent-sea` (Node.js SEA). This package provides a Node.js SEA (single executable application) variant of the GenT CLI.
- Root `package.json` uses npm workspaces.

## Workspace Command Discipline

- Run dependency operations (for example `npm install`) from repository root unless package-local behavior is required.
- Run feature scripts from each package directory unless explicit workspace flags are used.
- When running package scripts from repository root in this monorepo, always target the workspace explicitly with `-w` (for example `npm run -w @tomo-waka/gent build:tsc`).
- If you run scripts in package-local scope instead, set the current working directory to the target package directory first (for example `packages/gent`, `packages/gent-gui`, or `packages/gent-server`) before executing `npm run ...`.
- Do not assume scripts are shared across packages; check each package `package.json` first.

## Big-Picture Execution Flow (packages/gent)

- CLI entrypoint is `src/cli/cli.ts` (`commander` options: `--template` or `--profile` are required).
- `cli.ts` builds raw options, then normalizes via `normalizeProgramOptions` in `src/utils.ts`.
- `run` in `src/run.ts` orchestrates generation:
  - `createDocumentFeeder`
  - `createGeneratingDocumentStream`
  - `DocumentTransformStream`
  - output stream from `output/initializeOutput.ts`
- Template mode is inferred by extension (`.json` => json mode) in `determineTemplateModeByFile` (`src/utils.ts`).
- Text templates flow through `template/` + `commandTemplate/`; JSON templates flow through `json/` (`buildDocumentFromJsonTemplate.ts`).

## Command System Conventions

- Built-in commands are registered by side effect import: `import "./command/commands/index.js";` in `src/run.ts`.
- New commands should be added under `src/command/commands/**` and registered in `src/command/commands/index.ts`.
- `CommandManager` (`src/command/commandManager/commandManager.ts`) centrally applies global options such as `--variations` and `--escape`.
- Unsupported command names intentionally render `{{UNSUPPORTED_COMMAND}}`.
  Do not replace this behavior with thrown errors unless explicitly requested.

## Output and Meta Behavior

- CLI `--out` supports simple file output.
- Advanced output options (udp/tcp/tls, framing options, and related behaviors) are primarily controlled via meta JSON.
- Output options are normalized in `src/utils.ts` (`normalizeOutputOptions`) and executed in `output/initializeOutput.ts`.
- `initializeOutput.ts` cleans existing output files matching rotate patterns before writing.

## Generated and Derived Files

- Treat `packages/gent/generated/**` as generated artifacts.
- Do not hand-edit generated files unless explicitly requested for emergency fixes.
- Regenerate parser d.ts files via `npm run generate:dts` (`scripts/generateParserCstDts.ts`).
- Regenerate `generated/packageEnv.ts` via `npm run generate:package-env` (`scripts/generatePackageEnv.ts`; also runs on `npm version`).

## Validation Policy (Required Checks)

Run the minimum meaningful checks based on changed scope.

- If `packages/gent` behavior changes:
  - `npm run build:tsc`
  - plus one relevant smoke run: `npm run start`, `npm run start-json`, or `npm run start-meta`
- If `packages/gent-gui` source changes:
  - `npm run build`
  - and run `npm run lint` when React/TypeScript files were changed
- If `packages/gent-server` source changes:
  - `npm run build`
  - use `npm run dev` only when runtime smoke verification is needed

Notes:

- `packages/gent` currently has no real automated test suite (`npm test` is informational).
- Prefer targeted validation first, then broader validation when risk is higher.

## Documentation Sync Policy

When semantics change, docs must be updated in the same change set.

- CLI/options/meta/output semantics:
  - update `packages/gent/docs/output.md`
- Template command syntax, options, behavior:
  - update `packages/gent/docs/template-commands.md`
- Developer workflow changes:
  - update `packages/gent/docs/developing.md`
- If README-visible behavior changes:
  - update `packages/gent/README.md` (and root `README.md` when relevant)

## Commit Message Convention

- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`
- scope part should be the package name (for example `gent`, `gent-gui`, `gent-server`) or a relevant sub-area (for example `cli`, `output`, `template`).
- Examples: `feat(gent): add command`, `fix(gent-server): correct handler`, `docs: update README`

## Practical Editing Guidance

- General:
  - Keep ESM import style (`.js` extension in TS source imports) consistent with the existing codebase.
  - Prefer extending existing normalization/type-guard helpers in `src/utils.ts` and types in `src/types.ts` over ad-hoc parsing.
  - Fix root causes instead of adding narrow patches when feasible.
  - Keep changes minimal and scoped; avoid unrelated refactors.
- Comments:
  - Add comments only when intent is non-obvious from names, types, and structure.
  - Explain `why` (invariants, assumptions, edge-case rationale), not obvious `what` behavior.
  - Add comments for non-trivial branching/fallbacks, protocol or compatibility constraints, ordering dependencies/side effects, or performance/security tradeoffs.
  - Do not add comments for straightforward assignments, simple control flow, or self-explanatory transformations.
  - Keep comments brief (1-2 lines), colocated with the relevant logic, and synchronized with behavior changes.

## Copilot Response Contract for This Repository

When proposing or implementing non-trivial changes, responses should include:

- assumptions made
- what was validated (commands actually run)
- remaining risks or unverified areas
- one practical fallback or alternative approach when relevant

Keep outputs concise and actionable.
