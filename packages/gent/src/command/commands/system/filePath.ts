import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const filePath: StaticCommand = {
  name: "filePath",
  run: () => {
    return faker.system.filePath();
  },
};
