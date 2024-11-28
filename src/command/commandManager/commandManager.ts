import { faker } from "@faker-js/faker";
import type {
  ContextualStringOut,
  DocumentContext,
  DocumentOptions,
} from "../../document/index.js";
import { parseNonNaNInteger, parseString } from "../../utils.js";
import { GlobalOption_Escape, GlobalOption_Variations } from "../consts.js";
import type {
  Command,
  CommandOptions,
  EscapeStyle,
  StaticCommand,
} from "../type.js";
import { isEscapeStyle } from "../utils.js";

export interface CommandManager {
  setCommand(command: Command): this;

  getCommandContextualStringOut(
    commandName: string,
    commandOptions: Readonly<CommandOptions> | undefined,
    documentOptions: DocumentOptions,
  ): ContextualStringOut;
}

class CommandManagerImpl implements CommandManager {
  private readonly commandMap = new Map<string, Command>();

  public setCommand(command: Command): this {
    this.commandMap.set(command.name, command);
    return this;
  }

  private getCommand(commandName: string): Command {
    const command = this.commandMap.get(commandName);
    if (command !== undefined) {
      return command;
    }

    return createUnsupportedCommand(commandName);
  }

  public getCommandContextualStringOut(
    commandName: string,
    commandOptions: Readonly<CommandOptions> | undefined,
    documentOptions: DocumentOptions,
  ): ContextualStringOut {
    const staticOrNormalCommand = this.getCommand(commandName);
    let contextualStringOut: ContextualStringOut;
    if ("build" in staticOrNormalCommand) {
      contextualStringOut = staticOrNormalCommand.build(
        commandOptions,
        documentOptions,
      );
    } else {
      contextualStringOut = staticOrNormalCommand.run;
    }

    // process global options

    const variations = parseNonNaNInteger(
      commandOptions?.[GlobalOption_Variations],
    );
    if (variations !== undefined) {
      contextualStringOut = createVariationStringOut(
        contextualStringOut,
        variations,
      );
    }
    const escape = parseString(commandOptions?.[GlobalOption_Escape]);
    if (isEscapeStyle(escape)) {
      contextualStringOut = createEscapeStringOut(contextualStringOut, escape);
    }
    return contextualStringOut;
  }
}

export const commandManager: CommandManager = new CommandManagerImpl();

function createUnsupportedCommand(commandName: string): StaticCommand {
  return {
    name: commandName,
    run: () => {
      return "{{UNSUPPORTED_COMMAND}}";
    },
  };
}

function createVariationStringOut(
  baseContextualStringOut: ContextualStringOut,
  variations: number,
): ContextualStringOut {
  const valueArray: string[] = [];
  const maxIndex = variations - 1;
  return (context: DocumentContext): string => {
    const index = faker.number.int({
      min: 0,
      max: maxIndex,
    });
    let value = valueArray[index];

    if (value === undefined) {
      value = baseContextualStringOut(context);
      if (valueArray.length < variations) {
        if (!valueArray.includes(value)) {
          valueArray.push(value);
        }
      }
    }

    return value;
  };
}

function createEscapeStringOut(
  baseContextualStringOut: ContextualStringOut,
  style: EscapeStyle,
): ContextualStringOut {
  if (style === "json") {
    return (context: DocumentContext): string =>
      JSON.stringify(baseContextualStringOut(context));
  } else if (style === "doubleQuote") {
    return (context: DocumentContext): string => {
      const output = baseContextualStringOut(context);
      return `"${output.replaceAll('"', '""')}"`;
    };
  } else {
    console.log(`unsupported escape style: ${style}`);
    return baseContextualStringOut;
  }
}
