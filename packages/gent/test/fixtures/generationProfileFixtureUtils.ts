import * as fs from "node:fs";
import * as nodePath from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = nodePath.dirname(fileURLToPath(import.meta.url));
const fixtureDir = nodePath.resolve(
  currentDir,
  "../fixtures/generationProfiles",
);

export const validFixtureDir = nodePath.resolve(fixtureDir, "valid");
export const invalidFixtureDir = nodePath.resolve(fixtureDir, "invalid");

export function readGenerationProfileJsonFixture(fileName: string): unknown {
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

export const validFixtures = listFixtureFiles("valid");
export const invalidFixtures = listFixtureFiles("invalid");
