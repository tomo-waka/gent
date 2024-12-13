import * as dnsPromises from "node:dns/promises";
import * as net from "node:net";
import * as stream from "node:stream";
import type { TcpOutputOptions } from "../types.js";

export async function createTcpOutput(
  outputOptions: TcpOutputOptions,
): Promise<stream.Writable> {
  const lookupAddress = await dnsPromises.lookup(outputOptions.address, {
    verbatim: true,
  });
  const tcpOptions: net.TcpNetConnectOpts = {
    host: outputOptions.address,
    port: outputOptions.port,
    family: lookupAddress.family,
  };
  const client = net.connect(tcpOptions);
  return client;
}
