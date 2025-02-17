import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import * as stream from "node:stream";
import { FAILED, SUCCEEDED } from "./cliConsts.js";
import type { ResultCode } from "./cliTypes.js";
import { commandManager } from "./command/index.js";
import { MaxEps, TrailerMap } from "./consts.js";
import { createDocumentFeeder } from "./createDocumentFeeder.js";
import { createGeneratingDocumentStream } from "./createGeneratingDocumentStream.js";
import { debugFileWriter } from "./debugFileWriter.js";
import { DocumentTransformStream } from "./documentTransformStream.js";
import type { DocumentTransformOptions } from "./documentTransformTypes.js";
import { initializeOutput } from "./output/initializeOutput.js";
import type { ProgramOptions } from "./types.js";
import "./command/commands/index.js";

export async function run(programOptions: ProgramOptions): Promise<ResultCode> {
  const { debug, count, out, templates } = programOptions;

  // region out path

  const outPath = out.path;
  const outDirPath = nodePath.dirname(outPath);
  let existsOutDir: boolean = false;
  try {
    const stats = await fsPromises.stat(outDirPath);
    if (stats.isDirectory()) {
      existsOutDir = true;
    }
    await fsPromises.access(outDirPath, fs.constants.W_OK);
  } catch (error) {
    existsOutDir = false;
  }

  if (!existsOutDir) {
    try {
      await fsPromises.mkdir(outDirPath, { recursive: true });
    } catch (error) {
      console.error(`failed to create out path directory. ${outDirPath}`);
      console.log(error);
      return FAILED;
    }
  }

  try {
    await fsPromises.access(outDirPath, fs.constants.W_OK);
  } catch (error) {
    console.error(`cannot access out directory. ${outDirPath}`);
    console.log(error);
    return FAILED;
  }

  if (debug) {
    debugFileWriter.setBaseDirectory(outDirPath);
  }

  // endregion

  const documentFeeder = await createDocumentFeeder(
    templates,
    programOptions,
    commandManager,
  );

  const writeStream = await initializeOutput(out);

  let documentTransformOptions: DocumentTransformOptions;
  if (out.type === "file") {
    documentTransformOptions = {
      transformMode: "buffer",
      eps: MaxEps,
      framing: "non-transparent",
      trailer: "\n",
      trailerReplacer: undefined,
    };
  } else if (out.type === "udp") {
    documentTransformOptions = {
      transformMode: "object",
      eps: out.eps,
    };
  } else if (out.type === "tcp" || out.type === "tls") {
    if (out.framing === "octet-counting") {
      documentTransformOptions = {
        transformMode: "buffer",
        eps: out.eps,
        framing: "octet-counting",
      };
    } else if (out.framing === "lf") {
      const trailer = TrailerMap[out.framing];
      documentTransformOptions = {
        transformMode: "buffer",
        eps: out.eps,
        framing: "non-transparent",
        trailer: trailer,
        trailerReplacer: out.trailerReplacer,
      };
    } else {
      throw new Error(`Unexpected out options: ${out satisfies never}`);
    }
  } else {
    throw new Error(`Unexpected out options: ${out satisfies never}`);
  }

  const documentTransformStream = new DocumentTransformStream(
    documentTransformOptions,
    true,
  );

  const documentStream = createGeneratingDocumentStream(documentFeeder, count);

  stream.pipeline(
    documentStream,
    documentTransformStream,
    writeStream,
    (error) => {
      if (error !== null) {
        console.error(error);
      }
    },
  );

  return SUCCEEDED;
}
