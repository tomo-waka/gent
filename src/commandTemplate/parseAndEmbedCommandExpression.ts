import { parseCommand } from "../command/index.js";
import type { TemplateFragment } from "../template/index.js";
import type { CommandParsedTemplateFragment } from "./types.js";

export function parseAndEmbedCommandExpression(
  templateFragments: readonly TemplateFragment[],
): CommandParsedTemplateFragment[] {
  return templateFragments.map<CommandParsedTemplateFragment>(
    (templateFragment) => {
      if (typeof templateFragment === "string") {
        return templateFragment;
      } else {
        return parseCommand(templateFragment.expression);
      }
    },
  );
}
