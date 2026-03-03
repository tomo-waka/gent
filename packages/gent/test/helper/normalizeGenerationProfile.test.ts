import * as nodePath from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeGenerationProfile } from "../../src/helper/normalizeGenerationProfile.js";
import { validateGenerationProfileJson } from "../../src/helper/validateGenerationProfileJson.js";
import { readGenerationProfileJsonFixture } from "../fixtures/generationProfileFixtureUtils.js";

describe("normalizeGenerationProfile with validated profile", () => {
  it("normalizes validated profile into runtime options", () => {
    const basePath = nodePath.resolve("test");
    const profile = readGenerationProfileJsonFixture("valid/with-count.json");

    const validationResult = validateGenerationProfileJson(profile);
    expect(validationResult.success).toBe(true);
    if (!validationResult.success) {
      return;
    }

    const normalized = normalizeGenerationProfile(
      validationResult.value,
      basePath,
    );

    expect(normalized).toBeDefined();
    if (normalized === undefined) {
      return;
    }
    expect(normalized.count).toBe(10);
    expect(normalized.out.type).toBe("file");
    expect(normalized.templates[0]?.path).toBe(
      nodePath.resolve(basePath, "template.log"),
    );
    expect(normalized.templates[0]?.weight).toBe(2.5);
  });
});
