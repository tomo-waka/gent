import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * length
 * * variant: 'alpha-2' | 'alpha-3' | 'numeric' (default: 'alpha-2')
 */
export const countryCode: ProgrammableCommand = {
  name: "countryCode",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.location.countryCode(commandOptions);
  },
};
