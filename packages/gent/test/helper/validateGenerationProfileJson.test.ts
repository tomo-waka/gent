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
const validFixtureDir = nodePath.resolve(fixtureDir, "valid");
const invalidFixtureDir = nodePath.resolve(fixtureDir, "invalid");

function readJsonFixture(fileName: string): unknown {
  const filePath = nodePath.resolve(fixtureDir, fileName);
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  return JSON.parse(content) as unknown;
}

function listFixtureFiles(relativeDir: string): string[] {
  const absoluteDir = nodePath.resolve(fixtureDir, relativeDir);
  return fs
    .readdirSync(absoluteDir, { encoding: "utf8" })
    .filter((fileName) => fileName.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => `${relativeDir}/${fileName}`);
}

const validFixtures = listFixtureFiles("valid");
const invalidFixtures = listFixtureFiles("invalid");

describe("generationProfileJsonSchema", () => {
  it.each(validFixtures)("accepts valid fixture %s", (fixturePath) => {
    const profile = readJsonFixture(fixturePath);

    const parsed = generationProfileJsonSchema.safeParse(profile);
    expect(parsed.success).toBe(true);

    const result = validateGenerationProfileJson(profile);
    expect(result.success).toBe(true);
  });

  it.each(invalidFixtures)("rejects invalid fixture %s", (fixturePath) => {
    const profile = readJsonFixture(fixturePath);

    const result = validateGenerationProfileJson(profile);

    expect(result.success).toBe(false);
  });

  it("rejects unknown root property with strict-mode error", () => {
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
});

describe("normalizeProgramOptions with validated profile", () => {
  it("fixtures directory setup is present", () => {
    expect(fs.existsSync(validFixtureDir)).toBe(true);
    expect(fs.existsSync(invalidFixtureDir)).toBe(true);
    expect(validFixtures.length).toBeGreaterThan(0);
    expect(invalidFixtures.length).toBeGreaterThan(0);
  });

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
