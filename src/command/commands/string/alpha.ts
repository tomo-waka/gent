import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 * * casing: 'upper' | 'lower' | 'mixed' (default: 'mixed')
 */
export const alpha: ProgrammableCommand = {
  name: "alpha",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.string.alpha(commandOptions);
  },
};
