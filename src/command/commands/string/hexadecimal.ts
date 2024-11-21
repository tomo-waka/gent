import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 * * prefix (default:0x)
 */
export const hexadecimal: ProgrammableCommand = {
  name: "hexadecimal",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.string.hexadecimal(commandOptions);
  },
};
