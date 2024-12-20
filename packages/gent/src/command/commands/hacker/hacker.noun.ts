import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const hackerNounCommand: StaticCommand = {
  name: "hacker.noun",
  run: () => {
    return faker.hacker.noun();
  },
};
