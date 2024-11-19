import { globIterate } from "glob";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import * as stream from "node:stream";
import * as rfs from "rotating-file-stream";
import type { OutputOptions } from "../types.js";

export async function initializeOutput(
  outputOptions: OutputOptions,
): Promise<stream.Writable> {
  const rotateSize = outputOptions.size;
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

  if (rotateSize === undefined) {
    // no file rotation
    return fs.createWriteStream(nonRotateOutputPath);
  } else {
    // rotate file by size
    return rfs.createStream(
      (indexOrDate, indexOrUndefined) => {
        if (indexOrDate === null) {
          return nonRotateOutputPath;
        }
        let index: number;
        if (typeof indexOrDate === "number") {
          index = indexOrDate;
        } else if (typeof indexOrUndefined === "number") {
          index = indexOrUndefined;
        } else {
          index = 0;
        }
        return rotateOutputPathGenerator(index.toString());
      },
      { size: rotateSize },
    );
  }
}

async function cleanOutputDir(...globPaths: string[]): Promise<void> {
  for await (const path of globIterate(globPaths)) {
    await fsPromises.rm(path);
  }
}
