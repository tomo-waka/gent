import Ajv, { type AnySchema } from "ajv";
import addFormats from "ajv-formats";
import { describe, expect, it, beforeAll } from "vitest";
import { generationProfileSchema } from "../../generated/schema/generatedGenerationProfileSchema.js";
import {
  invalidFixtures,
  readGenerationProfileJsonFixture,
  validFixtures,
} from "./generationProfileFixtureUtils.js";

// This test validates that fixture JSONs conform to the generation profile schema.
// Test infrastructure, not production behavior.
describe("generationProfileFixtureSchema", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  it("schema is compilable", () => {
    const validate = ajv.compile(generationProfileSchema as AnySchema);
    expect(validate).toBeDefined();
  });

  it.each(validFixtures)(
    "valid fixture %s conforms to schema",
    (fixturePath) => {
      const fixture = readGenerationProfileJsonFixture(fixturePath);
      const validate = ajv.compile(generationProfileSchema as AnySchema);

      const valid = validate(fixture);
      if (!valid) {
        throw new Error(
          `Fixture ${fixturePath} does not conform to schema: ${ajv.errorsText(validate.errors)}`,
        );
      }
      expect(valid).toBe(true);
    },
  );

  it.each(invalidFixtures)(
    "invalid fixture %s fails schema validation",
    (fixturePath) => {
      const fixture = readGenerationProfileJsonFixture(fixturePath);
      const validate = ajv.compile(generationProfileSchema as AnySchema);

      const valid = validate(fixture);
      expect(valid).toBe(false);
      expect(validate.errors?.length).toBeGreaterThan(0);
    },
  );
});
