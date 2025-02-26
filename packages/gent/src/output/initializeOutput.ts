import { globIterate } from "glob";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import * as stream from "node:stream";
import type { OutputOptions } from "../types.js";
import { assertNever } from "../utils.js";
import { createFileOutput } from "./createFileOutput.js";
import { createTcpOutput } from "./createTcpOutput.js";
import { createTlsOutput } from "./createTlsOutput.js";
import type { RotateOutputPathGenerator } from "./types.js";
import { UdpDocumentStream } from "./udpDocumentStream.js";

export async function initializeOutput(
  outputOptions: OutputOptions,
): Promise<stream.Writable> {
  // region clean dir

  const outputPath = outputOptions.path;
  let rotateOutputPathGenerator: RotateOutputPathGenerator | undefined;
  if (outputPath !== undefined) {
    // when output path is specified, clean dir.
    const parsed = nodePath.parse(outputPath);
    rotateOutputPathGenerator = (additionalPhrase: string) => {
      const filename = `${parsed.name}.${additionalPhrase}${parsed.ext}`;
      return nodePath.join(parsed.dir, filename);
    };
    const nonRotateOutputGlobPath = outputPath.replaceAll("\\", "/");
    const rotateOutputGlobPath = rotateOutputPathGenerator("*").replaceAll(
      "\\",
      "/",
    );
    await cleanOutputDir(nonRotateOutputGlobPath, rotateOutputGlobPath);
  }

  // endregion

  if (outputOptions.type === "file") {
    if (rotateOutputPathGenerator === undefined) {
      throw new Error(
        "rotateOutputPathGenerator should be initialized at this point.",
      );
    }
    return createFileOutput(
      outputOptions.path,
      outputOptions.size,
      rotateOutputPathGenerator,
    );
  } else if (outputOptions.type === "udp") {
    return new UdpDocumentStream(outputOptions);
  } else if (outputOptions.type === "tcp") {
    return createTcpOutput(outputOptions);
  } else if (outputOptions.type === "tls") {
    return createTlsOutput(outputOptions);
  } else {
    return assertNever(outputOptions);
  }
}

async function cleanOutputDir(...globPaths: string[]): Promise<void> {
  for await (const path of globIterate(globPaths)) {
    await fsPromises.rm(path);
  }
}
