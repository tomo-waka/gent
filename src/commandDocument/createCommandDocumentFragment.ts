import type {
  CommandManager,
  StructuredCommandExpression,
} from "../command/index.js";
import type {
  ContextualDocumentFragment,
  ContextualStringOut,
  DocumentContext,
  DocumentOptions,
} from "../document/types.js";

class CommandDocumentFragmentImpl implements ContextualDocumentFragment {
  private readonly contextualStringOut: ContextualStringOut;

  constructor(
    structuredCommandExpression: StructuredCommandExpression,
    commandManager: CommandManager,
    documentOptions: DocumentOptions,
  ) {
    const commandOptions = structuredCommandExpression.options;
    this.contextualStringOut = commandManager.getCommandContextualStringOut(
      structuredCommandExpression.name,
      commandOptions,
      documentOptions,
    );
  }

  public toString(context: DocumentContext): string {
    return this.contextualStringOut(context);
  }
}

export function createCommandDocumentFragment(
  structuredCommandExpression: StructuredCommandExpression,
  commandManager: CommandManager,
  documentOptions: DocumentOptions,
): ContextualDocumentFragment {
  return new CommandDocumentFragmentImpl(
    structuredCommandExpression,
    commandManager,
    documentOptions,
  );
}
