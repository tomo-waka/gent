import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * issuer
 */
export const creditCardNumber: ProgrammableCommand = {
  name: "creditCardNumber",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.finance.creditCardNumber(commandOptions);
  },
};
