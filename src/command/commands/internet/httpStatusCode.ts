import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const httpStatusCode: StaticCommand = {
  name: "httpStatusCode",
  run: () => {
    return faker.internet.httpStatusCode().toString();
  },
};
