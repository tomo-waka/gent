import { faker } from "@faker-js/faker";
import type { StaticCommand } from "../../type.js";

export const imei: StaticCommand = {
  name: "imei",
  run: () => {
    return faker.phone.imei();
  },
};
