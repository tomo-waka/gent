import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 * * prefix (default:0b)
 */
export const binary: ProgrammableCommand = {
  name: "binary",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.string.binary(commandOptions);
  },
};
