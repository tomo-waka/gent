import type { AnySchema, ErrorObject, ValidateFunction } from "ajv";
import { beforeAll, describe, expect, it } from "vitest";
import { generationProfileSchema } from "../../generated/schema/generatedGenerationProfileSchema.js";
import {
  invalidFixtures,
  readGenerationProfileJsonFixture,
  validFixtures,
} from "./generationProfileFixtureUtils.js";

type AjvLike = {
  compile: (schema: AnySchema) => ValidateFunction;
  errorsText: (errors?: ErrorObject[] | null) => string;
};

type AjvCtor = new (options: {
  allErrors: boolean;
  strict: boolean;
  unevaluated: boolean;
}) => AjvLike;

type AddFormats = (ajv: AjvLike) => unknown;

// This test validates that fixture JSONs conform to the generation profile schema.
// Test infrastructure, not production behavior.
describe("generationProfileFixtureSchema", () => {
  let validate: ValidateFunction;
  let errorsText: (errors?: ErrorObject[] | null) => string;

  beforeAll(async () => {
    // Keep runtime path as .js for ESM resolution in tests.
    // We assert module shapes below to avoid no-unsafe-any lint errors.
    const [ajv2020Module, ajvFormatsModule] = await Promise.all([
      import("ajv/dist/2020.js"),
      import("ajv-formats"),
    ]);

    // ajv subpath imports can lose precise types under this test tsconfig,
    // so cast via unknown to explicit local structural types.
    const Ajv2020 = ajv2020Module.default as unknown as AjvCtor;
    const addFormats = ajvFormatsModule.default as unknown as AddFormats;

    const ajv = new Ajv2020({
      allErrors: true,
      strict: false,
      // Required so unevaluatedProperties in draft 2020-12 schemas is enforced.
      unevaluated: true,
    });
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
