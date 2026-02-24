#!/usr/bin/env node
import { Command, Option } from "commander";
import { packageEnv } from "../../generated/packageEnv.js";
import { FAILED } from "./cliConsts.js";
import { DEFAULT_TEMPLATE_WEIGHT } from "../consts.js";
import type { TemplateMode, TemplateOptions } from "../api/programOptions.js";
import { run } from "../run.js";
import {
  determineTemplateModeByFile,
  isNonNullObject,
  normalizeProgramOptions,
  parseAndResolveFilePath,
  parseString,
  tryReadFile,
} from "../utils.js";

const templateOption = new Option(
  "-t --template <template-file>",
  "path to template file",
);

const profileOption = new Option(
  "-p --profile <profile-file>",
  "path to generation profile file",
);

const countOption = new Option(
  "-c --count <number>",
  "number of logs to generate.",
).default(1);

const fromOption = new Option("-s --start <date-expression>", "from date");

const toOption = new Option("-e --end <date-expression>", "end date");

const outOption = new Option(
  "-o --out <path>",
  "path to output files.",
).default("./out.log");

const debugOption = new Option("-d --debug", "debug flag")
  .default(false)
  .hideHelp(true);

function main(): void {
  const program = new Command();

  program
    .name(packageEnv.name)
    .version(packageEnv.version)
    .description(packageEnv.description)
    .showHelpAfterError()
    .addOption(templateOption)
    .addOption(profileOption)
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
      const profile = parseString(options["profile"]);
      const template = parseString(options["template"]);
      let rawProgramOptions: unknown;
      if (profile !== undefined) {
        const resolvedFilePath = parseAndResolveFilePath(profile, cwd);
        if (resolvedFilePath === undefined) {
          program.error(`failed to resolve profile file path.(${profile})`, {
            exitCode: FAILED,
          });
          return;
        }
        let fileContent: string | undefined;
        try {
          fileContent = await tryReadFile(resolvedFilePath);
        } catch (error) {
          console.log(error);
        }
        if (fileContent === undefined) {
          program.error("failed to read profile file.", { exitCode: FAILED });
          return;
        }
        try {
          rawProgramOptions = JSON.parse(fileContent);
        } catch (error) {
          console.log(error);
          rawProgramOptions = undefined;
        }
        if (rawProgramOptions === undefined) {
          program.error("failed to parse profile file.", { exitCode: FAILED });
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
          "You must specify either template or profile option at least.",
          { exitCode: FAILED },
        );
        return;
      }

      const programOptions = normalizeProgramOptions(rawProgramOptions, cwd);
      if (programOptions === undefined) {
        program.error("invalid options.", { exitCode: FAILED });
        return;
      }

      try {
        await run(programOptions);
      } catch (error) {
        program.error(
          `Command failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
          { exitCode: FAILED },
        );
      }
    });

  program.parseAsync(process.argv).catch((error) => {
    console.error(error);
  });
}

main();
