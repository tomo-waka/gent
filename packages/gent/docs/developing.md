# Start developing

1. clone repository
2. run npm install
3. you can test program with following npm scripts.
   ```shell
   npm run start
   ```
4. or directory execute TypeScript source with npx.
   ```shell
   tsx src/cli.ts --template sample/syslog_RFC3164(ISO_Date).template.log --count 5 --out out/out.log --debug
   ```
5. build.
   ```shell
   npm run build
   ```
6. execute JavaScript.
   ```shell
   node dist/src/cli.js --template sample/syslog_RFC3164(ISO_Date).template.log --count 5 --out out/out.log --debug
   ```

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
npm run format
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

## JSON Schema and Type Generation

The project uses JSON Schema for Generation Profile validation and TypeScript type generation.

### Schema Files

- `schema/generation-profile.schema.json` - Main Generation Profile schema
- `schema/common.schema.json` - Shared definitions
- `schema/output/*.schema.json` - Output options schemas

### Generating Types

When you modify JSON Schema files, regenerate TypeScript types:

```shell
npm run generate:schema-types
```

This generates types in `generated/schema/` directory.

Generation Profile JSON (`--profile`) is validated at runtime by Zod schema in `src/options/generationProfileValidation.ts`.

**Note:** Runtime types (`ProgramOptions`, `OutputOptions`, etc.) with normalized values (like `Date` objects) are manually maintained in `src/api/`. If you change schema structure significantly, you may need to update these runtime types as well.

### AJV formats in gent-gui

In `packages/gent-gui`, JSON Forms `createAjv` already registers `ajv-formats` internally.

- Do not call `addFormats(ajv)` again in app code.
- Calling it twice can raise duplicate keyword errors such as `Keyword formatMaximum is already defined`.

## Unit Testing

Run unit tests with Vitest:

```shell
npm test
```

Watch mode:

```shell
npm run test:watch
```

### Code Coverage

Generate code coverage report:

```shell
npm run test:coverage
```

Coverage reports are generated in multiple formats:

- **Text**: Console output showing percentage-based metrics
- **HTML**: Interactive report at `coverage/lcov-report/index.html`
- **LCOV**: Machine-readable format at `coverage/lcov.info` for CI/CD integration

Thresholds are configured in `vitest.config.ts`. Current minimum thresholds: 70% for statements, branches, functions, and lines.
