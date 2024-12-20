import type { CommandManager } from "./command/index.js";
import type {
  ContextualDocumentFragment,
  DocumentContent,
  DocumentContext,
  DocumentOptions,
} from "./document/index.js";
import {
  createJsonableTransformer,
  JsonableValue,
  parseJsonable,
  stringifyJsonable,
} from "./json/index.js";

export function buildDocumentFromJsonTemplate(
  templateString: string,
  commandManager: CommandManager,
  documentOptions: DocumentOptions,
): DocumentContent {
  const jsonableTransformer = createJsonableTransformer(
    commandManager,
    documentOptions,
  );
  const jsonableValue = parseJsonable(templateString, jsonableTransformer);
  if (jsonableValue === undefined) {
    return [];
  }

  return [new JsonDocumentFragmentImpl(jsonableValue)];
}

class JsonDocumentFragmentImpl implements ContextualDocumentFragment {
  constructor(private readonly jsonableValue: JsonableValue) {}

  public toString(context: DocumentContext): string {
    let json: string | undefined;
    try {
      json = stringifyJsonable(this.jsonableValue, "", context);
    } catch (error) {
      console.error(error);
      json = undefined;
    }
    return json ?? "";
  }
}
