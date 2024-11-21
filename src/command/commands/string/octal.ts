import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 * * prefix (default:0o)
 */
export const octal: ProgrammableCommand = {
  name: "octal",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.string.octal(commandOptions);
  },
};
