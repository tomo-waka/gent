import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const email: StaticCommand = {
  name: "email",
  run: () => {
    return faker.internet.email();
  },
};
