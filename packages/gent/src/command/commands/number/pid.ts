import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

const MAX_PID = 32768;

export const pidCommand: StaticCommand = {
  name: "pid",
  run: () => {
    return faker.number
      .int({
        min: 0,
        max: MAX_PID,
      })
      .toString();
  },
};
