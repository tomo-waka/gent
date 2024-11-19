import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const ipv4Command: StaticCommand = {
  name: "ipv4",
  run: () => {
    return faker.internet.ipv4();
  },
};
