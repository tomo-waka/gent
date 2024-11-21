import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import { fileURLToPath } from "url";

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

const packageJsonPath = nodePath.resolve(__dirname, "../package.json");

const packageEnvPath = nodePath.resolve(
  __dirname,
  "../generated/packageEnv.ts",
);

const packageJsonString = await fsPromises.readFile(packageJsonPath, {
  encoding: "utf8",
});

const parsedPackageJson = JSON.parse(packageJsonString);

const UNKNOWN = "UNKNOWN";
const name = parsedPackageJson["name"] ?? UNKNOWN;
const version = parsedPackageJson["version"] ?? UNKNOWN;
const description = parsedPackageJson["description"] ?? UNKNOWN;

// language=TypeScript
const out = `// generated codes about package environmental information.
export const packageEnv = {
  name: "${name}",
  version: "${version}",
  description: "${description}"
} as const;
`;

await fsPromises.writeFile(packageEnvPath, out);
