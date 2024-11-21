import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const domainName: StaticCommand = {
  name: "domainName",
  run: () => {
    return faker.internet.domainName();
  },
};
