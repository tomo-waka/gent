import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const anytimeCommand: StaticCommand = {
  name: "anytime",
  run: () => {
    return faker.date.anytime().toISOString();
  },
};
