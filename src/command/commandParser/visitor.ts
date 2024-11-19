import { pickFirst, pickMany } from "../../utils.js";
import type { CommandOptions } from "../type.js";
import { commandParser, lex } from "./commandParser.js";
import type {
  CommandExpressionCstChildren,
  CommandNameCstChildren,
  CommandOptionCstChildren,
  CommandOptionKeyCstChildren,
  CommandOptionValueCstChildren,
  ICstNodeVisitor,
} from "./commandParser_cst.js";
import type {
  CommandExpressionFragment,
  CommandNameFragment,
  CommandOptionFragment,
  CommandOptionKeyFragment,
  CommandOptionValueFragment,
  ParsedCommandExpression,
} from "./types.js";

type Out = ParsedCommandExpression | ParsedCommandExpression[];

const BaseVisitor = commandParser.getBaseCstVisitorConstructor<
  unknown,
  Out | undefined
>();

class CommandVisitor
  extends BaseVisitor
  implements ICstNodeVisitor<unknown, Out | undefined>
{
  constructor() {
    super();
    this.validateVisitor();
  }

  public commandExpression(
    children: CommandExpressionCstChildren,
    param?: unknown,
  ): Out | undefined {
    const commandNameNode = children.commandName[0];
    if (commandNameNode === undefined) {
      return undefined;
    }
    const commandNameFragment = pickFirst(this.visit(commandNameNode));
    if (commandNameFragment?.type !== "name") {
      return undefined;
    }

    let hasOption = false;
    const commandOptions: CommandOptions = {};
    const commandOptionNodes = children.commandOption;
    pickMany(commandOptionNodes)
      .flatMap((commandOptionNode) => this.visit(commandOptionNode))
      .forEach((commandOptionFragment) => {
        if (commandOptionFragment === undefined) {
          return;
        }
        if (commandOptionFragment.type !== "option") {
          return;
        }
        commandOptions[commandOptionFragment.key] = commandOptionFragment.value;
        hasOption = true;
      });

    let commandExpressionFragment: CommandExpressionFragment;
    if (hasOption) {
      commandExpressionFragment = {
        type: "command",
        name: commandNameFragment.content,
        options: commandOptions,
      };
    } else {
      commandExpressionFragment = {
        type: "command",
        name: commandNameFragment.content,
      };
    }

    return commandExpressionFragment;
  }

  public commandName(
    children: CommandNameCstChildren,
    param?: unknown,
  ): Out | undefined {
    const commandNameToken = children.Identifier[0];
    if (commandNameToken === undefined) {
      return undefined;
    }
    const commandNameFragment: CommandNameFragment = {
      type: "name",
      content: commandNameToken.image,
    };
    return commandNameFragment;
  }

  public commandOption(
    children: CommandOptionCstChildren,
    param?: unknown,
  ): Out | undefined {
    const commandOptionKeyNode = children.commandOptionKey[0];
    if (commandOptionKeyNode === undefined) {
      return undefined;
    }
    const commandOptionKeyFragment = pickFirst(
      this.visit(commandOptionKeyNode),
    );
    if (commandOptionKeyFragment?.type !== "option-key") {
      return undefined;
    }

    let commandOptionValueFragment: CommandOptionValueFragment | undefined;
    const commandOptionValueNode = children.commandOptionValue?.[0];
    if (commandOptionValueNode !== undefined) {
      const possibleCommandOptionValue = pickFirst(
        this.visit(commandOptionValueNode),
      );
      if (possibleCommandOptionValue?.type === "option-value") {
        commandOptionValueFragment = possibleCommandOptionValue;
      }
    }

    let commandOptionFragment: CommandOptionFragment;
    if (commandOptionValueFragment === undefined) {
      commandOptionFragment = {
        type: "option",
        key: commandOptionKeyFragment.content,
        value: true,
      };
    } else {
      commandOptionFragment = {
        type: "option",
        key: commandOptionKeyFragment.content,
        value: commandOptionValueFragment.content,
      };
    }
    return commandOptionFragment;
  }

  public commandOptionKey(
    children: CommandOptionKeyCstChildren,
    param?: unknown,
  ): Out | undefined {
    const commandOptionKeyToken = children.CommandOptionKey[0];
    if (commandOptionKeyToken === undefined) {
      return undefined;
    }
    const key = commandOptionKeyToken.image;
    let actualKey: string;
    if (key.startsWith("--")) {
      actualKey = key.substring(2);
    } else if (key.startsWith("-")) {
      actualKey = key.substring(1);
    } else {
      actualKey = key;
    }

    const commandOptionKeyFragment: CommandOptionKeyFragment = {
      type: "option-key",
      content: actualKey,
    };
    return commandOptionKeyFragment;
  }

  public commandOptionValue(
    children: CommandOptionValueCstChildren,
    param?: unknown,
  ): Out | undefined {
    const numberToken = children.NumberLiteral?.[0];
    if (numberToken !== undefined) {
      const numberValue = Number.parseInt(numberToken.image);
      if (!Number.isNaN(numberValue)) {
        return {
          type: "option-value",
          content: numberValue,
        };
      }
    }

    const identifierToken = children.Identifier?.[0];
    const literalToken = identifierToken ?? children.Literal?.[0];
    if (literalToken !== undefined) {
      return {
        type: "option-value",
        content: literalToken.image,
      };
    }
    const quotedLiteralToken = children.QuotedLiteral?.[0];
    if (quotedLiteralToken !== undefined) {
      const quotedValue = quotedLiteralToken.image;
      return {
        type: "option-value",
        content: quotedValue.substring(1, quotedValue.length - 1),
      };
    }
    return undefined;
  }
}

const visitor = new CommandVisitor();

export function toAstVisitor(
  input: string,
): CommandExpressionFragment | undefined {
  const lexResult = lex(input);
  commandParser.input = lexResult.tokens;
  const cst = commandParser.commandExpression();
  if (commandParser.errors.length > 0) {
    throw Error(
      "parsing errors detected!\n" + commandParser.errors[0]?.message,
    );
  }
  const out = pickFirst(visitor.visit(cst));

  if (out?.type !== "command") {
    return undefined;
  }
  return out;
}
