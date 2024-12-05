import { Readable } from "node:stream";
import { WeightedItemFeeder } from "./common/weightedItemFeeder.js";
import {
  createDocumentContextIterator,
  type DocumentContent,
  GeneratingDocument,
} from "./document/index.js";

export function createGeneratingDocumentStream(
  documentFeeder: WeightedItemFeeder<DocumentContent>,
  count: number,
  objectMode: boolean = false,
): Readable {
  if (objectMode) {
    return Readable.from(generateGeneratingDocument(documentFeeder, count), {
      objectMode: true,
    });
  } else {
    return Readable.from(generate(documentFeeder, count), {
      objectMode: false,
    });
  }
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

function* generate(
  documentFeeder: WeightedItemFeeder<DocumentContent>,
  count: number,
): Generator<string> {
  const generatingDocumentIterator = generateGeneratingDocument(
    documentFeeder,
    count,
  );
  for (let generatingDocument of generatingDocumentIterator) {
    const output = generatingDocument.stamp();
    yield output + "\n";
  }
}
