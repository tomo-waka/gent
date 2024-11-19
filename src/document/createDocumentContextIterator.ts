import type { DocumentContext } from "./types.js";

class DocumentContextImpl implements DocumentContext {
  constructor(public readonly index: number) {}
}

export function createDocumentContextIterator(
  count: number,
  initialIndex?: number,
): IterableIterator<DocumentContext> {
  return generate(count, initialIndex);
}

function* generate(
  length: number,
  startIndex: number = 0,
): Generator<DocumentContext> {
  for (let i = startIndex; i < length; i++) {
    yield new DocumentContextImpl(i);
  }
}
