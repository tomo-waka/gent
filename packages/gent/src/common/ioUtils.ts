import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import { isString } from "./generalUtils.js";

export function parseAndResolveFilePath(
  value: unknown,
  basePath: string,
): string | undefined {
  if (!isString(value)) {
    return undefined;
  }
  if (nodePath.isAbsolute(value)) {
    return value;
  } else {
    return nodePath.resolve(basePath, value);
  }
}

export function getExtension(filePath: string): string {
  return nodePath.extname(filePath);
}

export async function tryReadFile(path: string): Promise<string> {
  try {
    await fsPromises.access(path, fs.constants.R_OK);
  } catch (error) {
    console.log(error);
    throw new Error(`cannot access the file. ${path}`);
  }
  let contentString: string | undefined;
  try {
    contentString = await fsPromises.readFile(path, {
      encoding: "utf8",
    });
  } catch (error) {
    console.log(error);
    throw new Error(`failed to read the file. ${path}`);
  }
  return contentString;
}
