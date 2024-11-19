import { faker } from "@faker-js/faker";
import type {
  ContextualStringOut,
  DocumentContext,
  DocumentOptions,
} from "../../document/index.js";
import { parseNonNaNInteger } from "../../utils.js";
import type { Command, CommandOptions, StaticCommand } from "../type.js";

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

    return this.createUnsupportedCommand(commandName);
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
    const variations = parseNonNaNInteger(commandOptions?.["variations"]);
    if (!staticOrNormalCommand.global && variations !== undefined) {
      contextualStringOut = createVariationStringOut(
        contextualStringOut,
        variations,
      );
    }
    return contextualStringOut;
  }

  private createUnsupportedCommand(commandName: string): StaticCommand {
    return {
      name: commandName,
      run: () => {
        return "{{UNSUPPORTED_COMMAND}}";
      },
    };
  }
}

export const commandManager: CommandManager = new CommandManagerImpl();

function createVariationStringOut(
  baseContextualStringOut: ContextualStringOut,
  variations: number,
): ContextualStringOut {
  const valueArray: string[] = [];
  const maxIndex = variations - 1;
  return (context: DocumentContext) => {
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
