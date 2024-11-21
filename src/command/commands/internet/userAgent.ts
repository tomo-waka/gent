import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const userAgent: StaticCommand = {
  name: "userAgent",
  run: () => {
    return faker.internet.userAgent();
  },
};
