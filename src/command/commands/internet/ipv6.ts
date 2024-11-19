import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const ipv6Command: StaticCommand = {
  name: "ipv6",
  run: () => {
    return faker.internet.ipv6();
  },
};
