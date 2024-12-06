import { Buffer } from "node:buffer";
import * as dnsPromises from "node:dns/promises";
import * as net from "node:net";
import { TrailerMap } from "../consts.js";
import { GeneratingDocument } from "../document/index.js";
import type { TcpFramingType, TcpOutputOptions } from "../types.js";
import { ThrottlingDocumentStream } from "./throttlingDocumentStream.js";

const SP = " " as const;

export class TcpDocumentStream extends ThrottlingDocumentStream {
  private readonly address: string;
  private readonly port: number;
  private readonly framing: TcpFramingType;
  private readonly trailerReplacer: string | undefined;

  private family: number | undefined;
  private client: net.Socket | undefined;

  constructor(options: TcpOutputOptions) {
    super(options.eps);

    this.address = options.address;
    this.port = options.port;
    if (options.framing === "octet-counting") {
      this.framing = options.framing;
    } else {
      this.framing = options.framing;
      this.trailerReplacer = options.trailerReplacer;
    }
  }

  public override _construct(callback: (error?: Error | null) => void): void {
    dnsPromises
      .lookup(this.address, {
        verbatim: true,
      })
      .then((lookupAddress) => {
        this.family = lookupAddress.family;
        callback();
      })
      .catch((reason) => callback(reason));
  }

  public override _throttledWrite(
    chunk: GeneratingDocument,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    const family = this.family;
    if (family === undefined) {
      callback(
        new Error("called write before family has not been determined."),
      );
      return;
    }

    let client = this.client;
    if (client === undefined) {
      const tcpOptions: net.TcpNetConnectOpts = {
        host: this.address,
        port: this.port,
        family: this.family,
      };
      client = net.connect(tcpOptions);
      this.client = client;
    }

    const outputString = chunk.stamp();
    let output: string | Buffer;
    if (this.framing === "lf") {
      const trailerReplacer = this.trailerReplacer;
      if (trailerReplacer !== undefined) {
        const trailer = TrailerMap[this.framing];
        output = outputString.replaceAll(trailer, trailerReplacer) + trailer;
      } else {
        const trailer = TrailerMap[this.framing];
        output = outputString + trailer;
      }
    } else if (this.framing === "octet-counting") {
      const messageBuf8 = Buffer.from(outputString, "utf-8");
      const lengthCount = messageBuf8.length.toString();
      const lengthBuf8 = Buffer.from(lengthCount + SP, "utf-8");
      output = Buffer.concat([lengthBuf8, messageBuf8]);
    } else {
      callback(new Error(`unexpected framing type ${this.framing}`));
      return;
    }

    client.write(output, (error) => {
      if (error !== null) {
        callback(error);
        return;
      }
      callback();
    });
  }

  protected _throttledFinal(callback: (error?: Error | null) => void): void {
    const client = this.client;
    if (client === undefined) {
      callback();
      return;
    }

    client.end(callback);
  }

  protected _throttledDestroy(
    error: Error | null,
    callback: (error?: Error | null) => void,
  ): void {
    const client = this.client;
    if (client === undefined) {
      callback(error);
      return;
    }
    if (error !== null) {
      client.destroy(error);
    } else {
      client.destroy();
    }
    callback(error);
  }
}
