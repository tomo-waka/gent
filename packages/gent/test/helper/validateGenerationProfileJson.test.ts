import { describe, expect, it } from "vitest";
import {
  generationProfileJsonSchema,
  validateGenerationProfileJson,
} from "../../src/helper/validateGenerationProfileJson.js";
import {
  invalidFixtures,
  readGenerationProfileJsonFixture,
  validFixtures,
} from "./generationProfileFixtureUtils.js";

describe("generationProfileJsonSchema", () => {
  it.each(validFixtures)("accepts valid fixture %s", (fixturePath) => {
    const profile = readGenerationProfileJsonFixture(fixturePath);

    const parsed = generationProfileJsonSchema.safeParse(profile);
    expect(parsed.success).toBe(true);

    const result = validateGenerationProfileJson(profile);
    expect(result.success).toBe(true);
  });

  it.each(invalidFixtures)("rejects invalid fixture %s", (fixturePath) => {
    const profile = readGenerationProfileJsonFixture(fixturePath);

    const result = validateGenerationProfileJson(profile);

    expect(result.success).toBe(false);
  });

  it("rejects unknown root property with strict-mode error", () => {
    const profile = readGenerationProfileJsonFixture(
      "invalid/unknown-root-property.json",
    );

    const result = validateGenerationProfileJson(profile);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(
      result.errors.some((error) =>
        error.toLowerCase().includes("unrecognized"),
      ),
    ).toBe(true);
  });
});
