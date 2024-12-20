import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * style: 'human' | 'national' | 'international' (default: 'human')
 */
export const phoneNumber: ProgrammableCommand = {
  name: "phone.number",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    return () => faker.phone.number(commandOptions);
  },
};
