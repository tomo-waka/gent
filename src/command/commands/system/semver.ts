import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const semver: StaticCommand = {
  name: "semver",
  run: () => {
    return faker.system.semver();
  },
};
