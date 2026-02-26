import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import { fileURLToPath } from "node:url";
import { isNonNullObject, isString } from "../src/common/generalUtils.js";

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

const packageJsonPath = nodePath.resolve(__dirname, "../package.json");

const packageEnvPath = nodePath.resolve(
  __dirname,
  "../generated/packageEnv.ts",
);

const packageJsonString = await fsPromises.readFile(packageJsonPath, {
  encoding: "utf8",
});

const parsedPackageJson: unknown = JSON.parse(packageJsonString);

if (!isNonNullObject(parsedPackageJson)) {
  throw new Error("invalid package.json");
}

const UNKNOWN = "UNKNOWN";
const fullName = parsedPackageJson["name"] ?? UNKNOWN;
const version = parsedPackageJson["version"] ?? UNKNOWN;
const description = parsedPackageJson["description"] ?? UNKNOWN;

if (!isString(fullName) || !isString(version) || !isString(description)) {
  throw new Error("invalid package.json");
}

const scopedNameRegex = /^(?:(@[^@\/]+)\/|)([^@\/]+)$/;

let name: string | undefined;
if (typeof fullName === "string") {
  const matchResults = fullName.match(scopedNameRegex);
  if (matchResults !== null) {
    name = matchResults[2];
  }
}
if (name == null || name === "") {
  name = UNKNOWN;
}

// language=TypeScript
const out = `// generated codes about package environmental information.
export const packageEnv = {
    fullName: "${fullName}",
    name: "${name}",
    version: "${version}",
    description: "${description}"
} as const;
`;

await fsPromises.writeFile(packageEnvPath, out);
