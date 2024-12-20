import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const ipCommand: StaticCommand = {
  name: "ip",
  run: () => {
    return faker.internet.ip();
  },
};
