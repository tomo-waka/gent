import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 * * casing: 'upper' | 'lower' | 'mixed' (default: 'mixed')
 */
export const alphanumeric: ProgrammableCommand = {
  name: "alphanumeric",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.string.alphanumeric(commandOptions);
  },
};
