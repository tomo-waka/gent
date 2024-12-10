import * as dgram from "node:dgram";
import * as dnsPromises from "node:dns/promises";
import { GeneratingDocument } from "../document/index.js";
import type { UdpOutputOptions } from "../types.js";
import { ThrottlingDocumentStream } from "./throttlingDocumentStream.js";

export class UdpDocumentStream extends ThrottlingDocumentStream {
  private readonly address: string;
  private readonly port: number;

  private socketType: dgram.SocketType | undefined;

  constructor(options: UdpOutputOptions) {
    super(options.eps);

    this.address = options.address;
    this.port = options.port;
  }

  public override _construct(callback: (error?: Error | null) => void): void {
    dnsPromises
      .lookup(this.address, {
        verbatim: true,
      })
      .then((lookupAddress) => {
        this.socketType = lookupAddress.family === 4 ? "udp4" : "udp6";
        callback();
      })
      .catch((reason) => callback(reason));
  }

  public override _throttledWrite(
    chunk: GeneratingDocument,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    const socketType = this.socketType;
    if (socketType === undefined) {
      callback(
        new Error("called write before socketType has not been determined."),
      );
      return;
    }

    const client = dgram.createSocket(socketType);
    client.send(chunk.stamp(), this.port, this.address, (error) => {
      client.close();

      if (error !== null) {
        callback(error);
        return;
      }
      callback();
    });
  }

  protected _throttledFinal(callback: (error?: Error | null) => void): void {
    callback();
  }

  protected _throttledDestroy(
    error: Error | null,
    callback: (error?: Error | null) => void,
  ): void {
    callback(error);
  }
}
