import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const mac: StaticCommand = {
  name: "mac",
  run: () => {
    return faker.internet.mac();
  },
};
