import type { CommandManager } from "../command/index.js";
import type { CommandParsedTemplateFragment } from "../commandTemplate/index.js";
import type { DocumentFragment, DocumentOptions } from "../document/index.js";
import { createCommandDocumentFragment } from "./createCommandDocumentFragment.js";

export function buildCommandDocumentFragments(
  parsedTemplateFragments: readonly CommandParsedTemplateFragment[],
  commandManager: CommandManager,
  documentOptions: DocumentOptions,
): DocumentFragment[] {
  return parsedTemplateFragments.map<DocumentFragment>(
    (parsedTemplateFragment) => {
      if (typeof parsedTemplateFragment === "string") {
        return parsedTemplateFragment;
      } else {
        return createCommandDocumentFragment(
          parsedTemplateFragment,
          commandManager,
          documentOptions,
        );
      }
    },
  );
}
