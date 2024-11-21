import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const creditCardCVV: StaticCommand = {
  name: "creditCardCVV",
  run: () => {
    return faker.finance.creditCardCVV();
  },
};
