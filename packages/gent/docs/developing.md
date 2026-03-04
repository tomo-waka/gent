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

## Monorepo-Wide Conventions

For rules shared across packages (for example commit message convention, lint/format policy, workspace settings), see [`docs/developing.md`](../../../docs/developing.md).

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
