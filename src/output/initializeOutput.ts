import { globIterate } from "glob";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import * as stream from "node:stream";
import type { OutputOptions } from "../types.js";
import { assertNever } from "../utils.js";
import { createFileOutput } from "./createFileOutput.js";

export async function initializeOutput(
  outputOptions: OutputOptions,
): Promise<stream.Writable> {
  // region clean dir

  const nonRotateOutputPath = outputOptions.path;
  const parsed = nodePath.parse(outputOptions.path);

  const rotateOutputPathGenerator = (additionalPhrase: string) => {
    const filename = `${parsed.name}.${additionalPhrase}${parsed.ext}`;
    return nodePath.join(parsed.dir, filename);
  };

  const nonRotateOutputGlobPath = nonRotateOutputPath.replaceAll("\\", "/");
  const rotateOutputGlobPath = rotateOutputPathGenerator("*").replaceAll(
    "\\",
    "/",
  );

  await cleanOutputDir(nonRotateOutputGlobPath, rotateOutputGlobPath);

  // endregion

  if (outputOptions.type === "file") {
    return createFileOutput(
      nonRotateOutputPath,
      outputOptions.size,
      rotateOutputPathGenerator,
    );
  } else {
    return assertNever(outputOptions.type);
  }
}

async function cleanOutputDir(...globPaths: string[]): Promise<void> {
  for await (const path of globIterate(globPaths)) {
    await fsPromises.rm(path);
  }
}
