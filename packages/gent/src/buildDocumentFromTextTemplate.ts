import * as nodePath from "node:path";
import type { CommandManager } from "./command/index.js";
import { buildCommandDocumentFragments } from "./commandDocument/index.js";
import { parseAndEmbedCommandExpression } from "./commandTemplate/index.js";
import { debugFileWriter } from "./debugFileWriter.js";
import type { DocumentContent, DocumentOptions } from "./document/index.js";
import { parseTemplate } from "./template/index.js";
import { isStringOnlyTemplateFragments } from "./template/utils.js";

export function buildDocumentFromTextTemplate(
  templateString: string,
  commandManager: CommandManager,
  documentOptions: DocumentOptions,
): DocumentContent {
  const templateFragments = parseTemplate(templateString);

  const fileName = nodePath.basename(documentOptions.path);
  if (fileName !== undefined) {
    debugFileWriter.writeFile(
      `${fileName}.parsed-template.json`,
      JSON.stringify(templateFragments, undefined, 2),
    );
  }

  const isStringOnly = isStringOnlyTemplateFragments(templateFragments);

  // output original string
  if (isStringOnly) {
    if (fileName !== undefined) {
      debugFileWriter.writeFile(
        `${fileName}.parsed-expression.json`,
        templateString,
      );
    }

    return templateString;
  }

  const parsedTemplateFragments =
    parseAndEmbedCommandExpression(templateFragments);

  if (fileName !== undefined) {
    debugFileWriter.writeFile(
      `${fileName}.parsed-expression.json`,
      JSON.stringify(parsedTemplateFragments, undefined, 2),
    );
  }

  return buildCommandDocumentFragments(
    parsedTemplateFragments,
    commandManager,
    documentOptions,
  );
}
