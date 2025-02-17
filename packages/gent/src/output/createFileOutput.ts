import * as fs from "node:fs";
import * as stream from "node:stream";
import * as rfs from "rotating-file-stream";
import type { RotateOutputPathGenerator } from "./types.js";

export async function createFileOutput(
  nonRotateOutputPath: string,
  rotateSize: string | undefined,
  rotateOutputPathGenerator: RotateOutputPathGenerator,
): Promise<stream.Writable> {
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
