import * as stream from "node:stream";
import { GeneratingDocument } from "../document/index.js";

const Per1000Window = 1000;
const Per100Window = 100;

type WriteCallback = (error?: Error | null) => void;
type WriteTask = [
  chunk: GeneratingDocument,
  encoding: BufferEncoding,
  callback: WriteCallback,
];

export abstract class ThrottlingDocumentStream extends stream.Writable {
  private readonly window: number;
  private readonly eventPerWindow: number;

  private readonly windowInternalTimeout;

  private eventInCurrentWindow: number;
  private pendingWriteTasks: WriteTask[] = [];

  private nThWindow = 0;
  private totalNumOfEvent = 0;

  protected constructor(eps: number, debug: boolean = false) {
    super({
      objectMode: true,
    });

    if (eps < Per100Window) {
      this.window = Per1000Window;
    } else {
      this.window = Per100Window;
    }
    this.eventPerWindow = Math.ceil(eps * (this.window / 1000));
    this.eventInCurrentWindow = 0;

    this.windowInternalTimeout = setInterval(() => {
      this._flushPendingWriteTasks();
      if (debug) {
        this.debugReport();
      }
      this.eventInCurrentWindow = 0;
    }, this.window);
  }

  private debugReport(): void {
    this.totalNumOfEvent = this.totalNumOfEvent + this.eventInCurrentWindow;
    this.nThWindow = this.nThWindow + 1;
    console.log(
      `[${this.nThWindow}] => ${this.eventInCurrentWindow}/${this.totalNumOfEvent}`,
    );
  }

  public override _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    if (!(chunk instanceof GeneratingDocument)) {
      callback(
        new Error(
          `Unexpected chunk type(${typeof chunk}). Cannot process any chunk type except Document.`,
        ),
      );
      return;
    }

    if (this.eventInCurrentWindow < this.eventPerWindow) {
      this._throttledWrite(chunk, encoding, callback);
      this.eventInCurrentWindow = this.eventInCurrentWindow + 1;
      return;
    }

    this.pendingWriteTasks.push([chunk, encoding, callback]);
  }

  protected abstract _throttledWrite(
    chunk: GeneratingDocument,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void;

  private _flushPendingWriteTasks(): void {
    const tasks = this.pendingWriteTasks;
    this.pendingWriteTasks = [];
    tasks.forEach(([chunk, encoding, callback]) =>
      this._throttledWrite(chunk, encoding, callback),
    );
  }

  private _clearWindowInternal(): void {
    clearInterval(this.windowInternalTimeout);
  }

  public override _final(callback: (error?: Error | null) => void): void {
    this._flushPendingWriteTasks();
    this._clearWindowInternal();
    this._throttledFinal(callback);
  }

  protected abstract _throttledFinal(
    callback: (error?: Error | null) => void,
  ): void;

  public override _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void,
  ): void {
    this._flushPendingWriteTasks();
    this._clearWindowInternal();
    this._throttledDestroy(error, callback);
  }

  protected abstract _throttledDestroy(
    error: Error | null,
    callback: (error?: Error | null) => void,
  ): void;
}
