import { faker } from "@faker-js/faker";
import type { CommandOptions, ProgrammableCommand } from "../../type.js";

/**
 * options
 * * min
 * * max
 */
export const loremSentencesCommand: ProgrammableCommand = {
  name: "lorem.sentences",
  build: (commandOptions: Readonly<CommandOptions> | undefined) => {
    // @ts-ignore
    return () => faker.lorem.sentences(commandOptions);
  },
};
