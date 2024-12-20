import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const directoryPath: StaticCommand = {
  name: "directoryPath",
  run: () => {
    return faker.system.directoryPath();
  },
};
