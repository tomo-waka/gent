import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const username: StaticCommand = {
  name: "username",
  run: () => {
    return faker.internet.username();
  },
};
