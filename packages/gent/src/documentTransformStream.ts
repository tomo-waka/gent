import { Buffer } from "node:buffer";
import * as stream from "node:stream";
import { GeneratingDocument } from "./document/index.js";
import type { DocumentTransformOptions } from "./documentTransformTypes.js";

const Per1000Window = 1000;
const Per100Window = 100;

type TransformTask = [
  document: GeneratingDocument,
  encoding: BufferEncoding,
  callback: stream.TransformCallback,
];

interface DocumentTransformer {
  (document: GeneratingDocument, encoding: BufferEncoding): readonly Buffer[];
}

export class DocumentTransformStream extends stream.Transform {
  private readonly documentTransformer: DocumentTransformer | undefined;

  private readonly timeWindow: number;
  private readonly numOfEventPerTimeWindow: number;

  private readonly timeWindowIntervalTimeout;

  private numOfEventInCurrentTimeWindow: number;
  private pendingTransformTasks: TransformTask[] = [];

  private nThTimeWindow = 0;
  private totalNumOfEvent = 0;

  constructor(options: DocumentTransformOptions, debug: boolean = false) {
    super({
      highWaterMark: 0,
      objectMode: true,
    });
    const transformMode = options.transformMode;
    if (transformMode === "object") {
      this.documentTransformer = undefined;
    } else if (transformMode === "buffer") {
      const framing = options.framing;
      if (framing === "octet-counting") {
        this.documentTransformer = transformDocumentIntoOctetCountingBuffer;
      } else if (framing === "non-transparent") {
        this.documentTransformer = createNonTransparentDocumentTransformer(
          options.trailer,
          options.trailerReplacer,
        );
      } else {
        throw new Error(`Unexpected framingMethod: ${framing satisfies never}`);
      }
    } else {
      throw new Error(
        `Unexpected transferMode: ${transformMode satisfies never}`,
      );
    }

    if (options.eps < Per100Window) {
      this.timeWindow = Per1000Window;
    } else {
      this.timeWindow = Per100Window;
    }
    this.numOfEventPerTimeWindow = Math.ceil(
      options.eps * (this.timeWindow / 1000),
    );
    this.numOfEventInCurrentTimeWindow = 0;

    this.timeWindowIntervalTimeout = setInterval(() => {
      this.__flushPendingTransformTasks();
      if (debug) {
        this.debugReport();
      }
      this.numOfEventInCurrentTimeWindow = 0;
    }, this.timeWindow);
  }

  private debugReport(): void {
    this.totalNumOfEvent =
      this.totalNumOfEvent + this.numOfEventInCurrentTimeWindow;
    this.nThTimeWindow = this.nThTimeWindow + 1;
    console.log(
      `[${this.nThTimeWindow}] => ${this.numOfEventInCurrentTimeWindow}/${this.totalNumOfEvent}`,
    );
  }

  public override _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: stream.TransformCallback,
  ): void {
    if (!(chunk instanceof GeneratingDocument)) {
      callback(
        new Error(
          `Unexpected chunk type(${typeof chunk}). Cannot process any chunk type except Document.`,
        ),
      );
      return;
    }

    if (this.numOfEventInCurrentTimeWindow < this.numOfEventPerTimeWindow) {
      this.numOfEventInCurrentTimeWindow =
        this.numOfEventInCurrentTimeWindow + 1;
      this.__transformDocument(chunk, encoding, callback);
      return;
    }

    this.pendingTransformTasks.push([chunk, encoding, callback]);
  }

  public override _flush(callback: stream.TransformCallback): void {
    this.__flushPendingTransformTasks();
    this.__clearWindowInternal();
    callback();
  }

  private __transformDocument(
    document: GeneratingDocument,
    encoding: BufferEncoding,
    callback: stream.TransformCallback,
  ): void {
    const documentTransformer = this.documentTransformer;
    if (documentTransformer === undefined) {
      callback(null, document);
      return;
    }

    const bufferArray = documentTransformer(document, encoding);
    bufferArray.forEach((buffer) => this.push(buffer, encoding));
    callback();
  }

  private __flushPendingTransformTasks(): void {
    const tasks = this.pendingTransformTasks;
    this.pendingTransformTasks = [];
    tasks.forEach(([document, encoding, callback]) =>
      this.__transformDocument(document, encoding, callback),
    );
  }

  private __clearWindowInternal(): void {
    clearInterval(this.timeWindowIntervalTimeout);
  }
}

const SP = " ";

function transformDocumentIntoOctetCountingBuffer(
  document: GeneratingDocument,
  encoding: BufferEncoding,
): readonly Buffer[] {
  const outputString = document.stamp();
  const messageBuf8 = Buffer.from(outputString, encoding);
  const lengthCount = messageBuf8.length.toString();
  const lengthBuf8 = Buffer.from(lengthCount + SP, encoding);
  return [lengthBuf8, messageBuf8];
}

function createNonTransparentDocumentTransformer(
  trailer: string,
  trailerReplacer: string | undefined,
): DocumentTransformer {
  return (
    document: GeneratingDocument,
    encoding: BufferEncoding,
  ): readonly Buffer[] => {
    let outputString = document.stamp();
    if (trailerReplacer !== undefined) {
      outputString = outputString.replaceAll(trailer, trailerReplacer);
    }
    return [
      Buffer.from(outputString, encoding),
      Buffer.from(trailer, encoding),
    ];
  };
}
