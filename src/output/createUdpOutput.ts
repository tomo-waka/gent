import * as stream from "node:stream";
import type { UdpOutputOptions } from "../types.js";
import { UpdStream } from "./updStream.js";

export async function createUdpOutput(
  outputOptions: UdpOutputOptions,
): Promise<stream.Writable> {
  return new UpdStream(outputOptions);
}
