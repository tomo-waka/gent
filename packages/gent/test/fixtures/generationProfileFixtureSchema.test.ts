import type { AnySchema, ErrorObject, ValidateFunction } from "ajv";
import type { FormatsPlugin } from "ajv-formats";
import { beforeAll, describe, expect, it } from "vitest";
import { generationProfileSchema } from "../../generated/schema/generatedGenerationProfileSchema.js";
import {
  invalidFixtures,
  readGenerationProfileJsonFixture,
  validFixtures,
} from "./generationProfileFixtureUtils.js";

// This test validates that fixture JSONs conform to the generation profile schema.
// Test infrastructure, not production behavior.
describe("generationProfileFixtureSchema", () => {
  let validate: ValidateFunction;
  let errorsText: (errors?: ErrorObject[] | null) => string;

  beforeAll(async () => {
    const [{ Ajv }, ajvFormatsModule] = await Promise.all([
      import("ajv"),
      import("ajv-formats"),
    ]);
    const addFormats = ajvFormatsModule.default as unknown as FormatsPlugin;

    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    validate = ajv.compile(generationProfileSchema as AnySchema);
    errorsText = (errors) => ajv.errorsText(errors);
  });

  it("schema is compilable", () => {
    expect(validate).toBeDefined();
  });

  it.each(validFixtures)(
    "valid fixture %s conforms to schema",
    (fixturePath) => {
      const fixture = readGenerationProfileJsonFixture(fixturePath);

      const valid = validate(fixture);
      if (!valid) {
        throw new Error(
          `Fixture ${fixturePath} does not conform to schema: ${errorsText(validate.errors)}`,
        );
      }
      expect(valid).toBe(true);
    },
  );

  it.each(invalidFixtures)(
    "invalid fixture %s fails schema validation",
    (fixturePath) => {
      const fixture = readGenerationProfileJsonFixture(fixturePath);

      const valid = validate(fixture);
      expect(valid).toBe(false);
      expect(validate.errors?.length).toBeGreaterThan(0);
    },
  );
});
