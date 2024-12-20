import type { DocumentContent, DocumentContext } from "./types.js";
import { stampDocument } from "./utils.js";

export class GeneratingDocument {
  constructor(
    private readonly content: DocumentContent,
    private readonly context: DocumentContext,
  ) {}

  public stamp(): string {
    return stampDocument(this.content, this.context);
  }
}
