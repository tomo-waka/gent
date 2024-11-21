import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const networkInterface: StaticCommand = {
  name: "networkInterface",
  run: () => {
    return faker.system.networkInterface();
  },
};
