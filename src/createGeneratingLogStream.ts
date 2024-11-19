import { Readable } from "node:stream";
import { WeightedItemFeeder } from "./common/weightedItemFeeder.js";
import type { DocumentContent } from "./document/index.js";
import {
  createDocumentContextIterator,
  stampDocumentContent,
} from "./document/index.js";

export function createGeneratingLogStream(
  documentFeeder: WeightedItemFeeder<DocumentContent>,
  count: number,
): Readable {
  return Readable.from(generate(documentFeeder, count));
}

function* generate(
  documentFeeder: WeightedItemFeeder<DocumentContent>,
  count: number,
): Generator<string> {
  const documentContextIterator = createDocumentContextIterator(count);
  for (let documentContext of documentContextIterator) {
    const document = documentFeeder.getItem();
    let output: string;
    if (document === undefined) {
      console.error("no document found.");
      output = "";
    } else {
      output = stampDocumentContent(document, documentContext);
    }
    yield output + "\n";
  }
}
