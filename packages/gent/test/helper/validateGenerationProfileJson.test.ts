import * as fs from "node:fs";
import * as nodePath from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { normalizeGenerationProfile } from "../../src/helper/normalizeGenerationProfile.js";
import {
  generationProfileJsonSchema,
  validateGenerationProfileJson,
} from "../../src/helper/validateGenerationProfileJson.js";

const currentDir = nodePath.dirname(fileURLToPath(import.meta.url));
const fixtureDir = nodePath.resolve(
  currentDir,
  "../fixtures/generationProfiles",
);

function readJsonFixture(fileName: string): unknown {
  const filePath = nodePath.resolve(fixtureDir, fileName);
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  return JSON.parse(content) as unknown;
}

describe("generationProfileJsonSchema", () => {
  it("accepts a minimal valid profile", () => {
    const profile = readJsonFixture("valid/minimal.json");

    const parsed = generationProfileJsonSchema.safeParse(profile);

    expect(parsed.success).toBe(true);
  });

  it("accepts profile with $schema and network output", () => {
    const profile = readJsonFixture("valid/network-tcp-lf.json");

    const result = validateGenerationProfileJson(profile);

    expect(result.success).toBe(true);
  });

  it("rejects unknown root property", () => {
    const profile = readJsonFixture("invalid/unknown-root-property.json");

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

  it("rejects invalid numberLike value", () => {
    const profile = readJsonFixture("invalid/invalid-number-like.json");

    const result = validateGenerationProfileJson(profile);

    expect(result.success).toBe(false);
  });
});

describe("normalizeProgramOptions with validated profile", () => {
  it("normalizes validated profile into runtime options", () => {
    const basePath = nodePath.resolve("test");
    const profile = readJsonFixture("valid/with-count.json");

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
