import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const mimeType: StaticCommand = {
  name: "mimeType",
  run: () => {
    return faker.system.mimeType();
  },
};
