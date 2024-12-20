import type { DocumentContent, DocumentContext } from "./types.js";

export function stampDocument(
  content: DocumentContent,
  context: DocumentContext,
): string {
  if (typeof content === "string") {
    return content;
  }
  return content
    .map<string>((documentFragment) => documentFragment.toString(context))
    .join("");
}
