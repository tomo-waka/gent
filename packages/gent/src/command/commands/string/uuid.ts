import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const uuid: StaticCommand = {
  name: "uuid",
  run: () => {
    return faker.string.uuid();
  },
};
