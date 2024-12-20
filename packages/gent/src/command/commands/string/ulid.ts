import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const ulid: StaticCommand = {
  name: "ulid",
  run: () => {
    return faker.string.ulid();
  },
};
