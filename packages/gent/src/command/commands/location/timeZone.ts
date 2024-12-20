import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const timeZone: StaticCommand = {
  name: "timeZone",
  run: () => {
    return faker.location.timeZone();
  },
};
