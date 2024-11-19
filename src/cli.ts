#!/usr/bin/env node
import { Command, Option } from "commander";
import { FAILED, SUCCEEDED } from "./cliConsts.js";
import { DEFAULT_TEMPLATE_WEIGHT } from "./consts.js";
import { run } from "./run.js";
import type { TemplateMode, TemplateOptions } from "./types.js";
import {
  determineTemplateModeByFile,
  isNonNullObject,
  normalizeProgramOptions,
  parseAndResolveFilePath,
  parseString,
  tryReadFile,
} from "./utils.js";

const templateOption = new Option(
  "-t --template <template-file>",
  "path to template file",
);

const metaOption = new Option("-m --meta <meta-file>", "path to meta file");

const countOption = new Option(
  "-c --count <number>",
  "number of logs to generate.",
).default(0);

const fromOption = new Option("-s --start <date-expression>", "from date");

const toOption = new Option("-e --end <date-expression>", "end date");

const outOption = new Option(
  "-o --out <path>",
  "path to output files.",
).default("./out/out.log");

const debugOption = new Option("-d --debug", "debug flat")
  .default(false)
  .hideHelp(true);

async function main(): Promise<void> {
  const program = new Command();

  program
    .version("0.0.0")
    .name("yet another log generator")
    .description("yet another log generator.")
    .addOption(templateOption)
    .addOption(metaOption)
    .addOption(fromOption)
    .addOption(toOption)
    .addOption(countOption)
    .addOption(outOption)
    .addOption(debugOption)
    .action(async (...args: unknown[]) => {
      const [options] = args;
      if (!isNonNullObject(options)) {
        program.error("Invalid option values.", { exitCode: FAILED });
        return;
      }

      const cwd = process.cwd();
      const meta = parseString(options["meta"]);
      const template = parseString(options["template"]);
      let rawProgramOptions: unknown;
      if (meta !== undefined) {
        const resolvedFilePath = parseAndResolveFilePath(meta, cwd);
        if (resolvedFilePath === undefined) {
          program.error(`failed to resolve meta file path.(${meta})`);
          return;
        }
        let fileContent: string | undefined;
        try {
          fileContent = await tryReadFile(resolvedFilePath);
        } catch (error) {
          console.log(error);
        }
        if (fileContent === undefined) {
          program.error("failed to read meta file.");
          return;
        }
        try {
          rawProgramOptions = JSON.parse(fileContent);
        } catch (error) {
          console.log(error);
          rawProgramOptions = undefined;
        }
        if (rawProgramOptions === undefined) {
          program.error("failed to parse meta file.");
          return;
        }
      } else if (template !== undefined) {
        const mode: TemplateMode = determineTemplateModeByFile(template);
        const templateOptions: TemplateOptions = {
          mode: mode,
          path: template,
          weight: DEFAULT_TEMPLATE_WEIGHT,
        };

        rawProgramOptions = {
          debug: options["debug"],
          from: options["start"],
          to: options["end"],
          count: options["count"],
          out: options["out"],
          templates: [templateOptions],
        };
      } else {
        program.error(
          "You must specify either template or meta option at least.",
          { exitCode: FAILED },
        );
        return;
      }

      const programOptions = normalizeProgramOptions(rawProgramOptions, cwd);
      if (programOptions === undefined) {
        program.error("invalid options.", { exitCode: FAILED });
        return;
      }

      const resultCode = await run(programOptions);
      if (resultCode !== SUCCEEDED) {
        program.error("Command has failed", { exitCode: resultCode });
      }
    });

  await program.parseAsync(process.argv);
}

await main();
