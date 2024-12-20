import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 */
export const numeric: ProgrammableCommand = {
  name: "numeric",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.string.numeric(commandOptions);
  },
};
