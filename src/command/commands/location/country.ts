import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const country: StaticCommand = {
  name: "country",
  run: () => {
    return faker.location.country();
  },
};
