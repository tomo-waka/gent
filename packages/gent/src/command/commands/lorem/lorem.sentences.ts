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
    // @ts-expect-error skip strict type check for command options for now.
    return () => faker.lorem.sentences(commandOptions);
  },
};
