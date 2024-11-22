import * as dgram from "node:dgram";
import * as dnsPromises from "node:dns/promises";
import * as stream from "node:stream";

export interface UdpStreamOptions extends stream.WritableOptions {
  readonly address: string;
  readonly port: number;
}

export class UpdStream extends stream.Writable {
  private readonly address: string;
  private readonly port: number;

  private chunks: any[];
  private chunkSize: number;
  private client: dgram.Socket | undefined;

  constructor(options: UdpStreamOptions) {
    super(options);

    this.address = options.address;
    this.port = options.port;

    this.chunks = [];
    this.chunkSize = 0;
  }

  public override _construct(callback: (error?: Error | null) => void) {
    dnsPromises
      .lookup(this.address, {
        verbatim: true,
      })
      .then((lookupAddress) => {
        const socketType: dgram.SocketType =
          lookupAddress.family === 4 ? "udp4" : "udp6";
        this.client = dgram.createSocket(socketType);
        callback();
      })
      .catch((reason) => callback(reason));
  }

  public override _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    const client = this.client;
    if (client === undefined) {
      callback(
        new Error("called write while client has not been initialized."),
      );
      return;
    }

    this.chunks.push(chunk);
    this.chunkSize = this.chunkSize + chunk.length;
    if (this.chunkSize > this.writableHighWaterMark) {
      client.send(
        Buffer.concat(this.chunks),
        this.port,
        this.address,
        (error) => {
          if (error !== null) {
            callback(error);
            return;
          }

          this.chunks = [];
          this.chunkSize = 0;

          callback();
        },
      );
    } else {
      callback();
    }
  }

  public override _final(callback: (error?: Error | null) => void): void {
    const client = this.client;
    if (client === undefined) {
      callback(
        new Error("called write while client has not been initialized."),
      );
      return;
    }

    client.send(
      Buffer.concat(this.chunks),
      this.port,
      this.address,
      (error) => {
        if (error !== null) {
          callback(error);
          return;
        }

        this.chunks = [];
        this.chunkSize = 0;

        callback();
      },
    );
  }

  public override _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void,
  ): void {
    console.log("closing udp stream.");
    if (this.client !== undefined) {
      this.client.close(callback);
    } else {
      callback(error);
    }
  }
}
