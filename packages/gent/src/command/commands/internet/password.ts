import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 */
export const password: ProgrammableCommand = {
  name: "password",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.internet.password(commandOptions);
  },
};
