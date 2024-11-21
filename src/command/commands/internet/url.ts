import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const url: StaticCommand = {
  name: "url",
  run: () => {
    return faker.internet.url();
  },
};
