
# Copilot Instructions for GenT

## Project Overview
**GenT** is a template-driven data generator for producing test data, especially for end-to-end testing. The core logic is in `packages/gent/`, with the CLI entry at `src/cli.ts`. Templates are plain text with embedded commands for dynamic content.

## Architecture & Data Flow
- **Templates**: Use `{{command}}` syntax for dynamic values. See `docs/template-commands.md` for all commands.
- **Meta files**: JSON orchestrators (see `sample/meta.json`) that define multi-template runs, output config, and probabilities.
- **Outputs**: Supports file, UDP, TCP, and TLS. Output config is richer in meta files than CLI. See `docs/output.md`.
- **Command Parsing**: Template commands are parsed and executed via `src/command/` and `src/template/`.
- **Extensibility**: Add new template commands in `src/command/commands/`. Add new output types in `src/output/`.

## Developer Workflows
- **Install dependencies**: `npm install` (root or `packages/gent/`)
- **Run CLI (dev)**: `npx tsx src/cli.ts --template sample/aws_CloudWatch.json --count 5 --out out.log --debug`
- **Build**: `npm run build` (see `package.json`)
- **Run built CLI**: `node dist/src/cli.js ...`
- **Generate parser/types**: Run scripts in `scripts/` (e.g., `generateParserCstDts.ts`)

## Project-Specific Patterns
- **Template commands**: Always use double curly braces, e.g. `{{timestamp}}`, `{{ipv4}}`, `{{hacker.noun --variations 3}}`
- **Command options**: Shell-like, e.g. `{{command --optA --optBWithValue value}}`
- **Meta file keys**: `from`, `to`, `count`, `out`, `templates`
- **Output config**: In meta files, `out` can be a string or an object with type/size/connection details
- **Debugging**: Use `--debug` CLI flag for verbose output

## Key Files & Directories
- `src/cli.ts`: CLI entry point
- `src/command/`: Command parsing and management
- `src/template/`: Template parsing and utilities
- `docs/template-commands.md`: List of available template commands
- `docs/output.md`: Output configuration reference
- `sample/`: Example templates and meta files

## Integration & Extensibility
- Add new template commands in `src/command/commands/` and document in `docs/template-commands.md`
- Add new output types in `src/output/` and document in `docs/output.md`

## Conventions
- Prefer plain text templates and JSON meta files for configuration
- Use shell-like syntax for command options in templates
- Document all new commands and outputs in `docs/`

---
For more, see `README.md` and `docs/` in `packages/gent/`.
