import * as stream from "node:stream";
import { WeightedItemFeeder } from "./common/weightedItemFeeder.js";
import {
  createDocumentContextIterator,
  type DocumentContent,
  GeneratingDocument,
} from "./document/index.js";

export function createGeneratingDocumentStream(
  documentFeeder: WeightedItemFeeder<DocumentContent>,
  count: number,
): stream.Readable {
  return stream.Readable.from(
    generateGeneratingDocument(documentFeeder, count),
    {
      objectMode: true,
    },
  );
}

function* generateGeneratingDocument(
  documentFeeder: WeightedItemFeeder<DocumentContent>,
  count: number,
): Generator<GeneratingDocument> {
  const documentContextIterator = createDocumentContextIterator(count);
  for (let context of documentContextIterator) {
    let document = documentFeeder.getItem();
    if (document === undefined) {
      console.error("no document found.");
      document = "";
    }
    yield new GeneratingDocument(document, context);
  }
}
