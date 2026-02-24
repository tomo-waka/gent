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

- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`
- Examples: `feat(gent): add command`, `fix(gent-server): correct handler`, `docs: update README`

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
