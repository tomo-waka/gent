import * as fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  invalidFixtureDir,
  invalidFixtures,
  readGenerationProfileJsonFixture,
  validFixtureDir,
  validFixtures,
} from "./generationProfileFixtureUtils.js";

// These checks guard test-fixture assumptions so helper/behavior tests fail with clearer causes.
// They are intentionally about test infrastructure, not production runtime behavior.
describe("generationProfileFixtureUtils", () => {
  it("fixtures directory setup is present", () => {
    expect(fs.existsSync(validFixtureDir)).toBe(true);
    expect(fs.existsSync(invalidFixtureDir)).toBe(true);
    expect(validFixtures.length).toBeGreaterThan(0);
    expect(invalidFixtures.length).toBeGreaterThan(0);
  });

  it("reads fixture JSON as object", () => {
    const fixture = readGenerationProfileJsonFixture("valid/with-count.json");

    expect(fixture).toBeTypeOf("object");
    expect(fixture).not.toBeNull();
  });
});
