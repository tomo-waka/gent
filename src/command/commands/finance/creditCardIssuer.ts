import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const creditCardIssuer: StaticCommand = {
  name: "creditCardIssuer",
  run: () => {
    return faker.finance.creditCardIssuer();
  },
};
