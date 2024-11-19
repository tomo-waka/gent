import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const priCommand: StaticCommand = {
  name: "pri",
  run: () => {
    return faker.number
      .int({
        min: 0,
        max: 191,
      })
      .toString();
  },
};
