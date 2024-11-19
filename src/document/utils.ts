import type { DocumentContent, DocumentContext } from "./types.js";

export function stampDocumentContent(
  documentContent: DocumentContent,
  context: DocumentContext,
): string {
  if (typeof documentContent === "string") {
    return documentContent;
  }
  return documentContent
    .map<string>((documentFragment) => documentFragment.toString(context))
    .join("");
}
