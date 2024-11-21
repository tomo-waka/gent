import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const httpMethod: StaticCommand = {
  name: "httpMethod",
  run: () => {
    return faker.internet.httpMethod();
  },
};
