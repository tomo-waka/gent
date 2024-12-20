import type {
  ContextualStringOut,
  DocumentOptions,
} from "../document/index.js";
import type { EscapeStyles } from "./consts.js";

export interface StructuredCommandExpression {
  readonly expression: string;
  readonly name: string;
  readonly arguments?: readonly string[];
  readonly options?: Readonly<CommandOptions>;
}

interface PrimitiveCommand {
  readonly name: string;
}

export interface StaticCommand extends PrimitiveCommand {
  readonly run: ContextualStringOut;
}

export interface ProgrammableCommand extends PrimitiveCommand {
  build(
    commandOptions: Readonly<CommandOptions> | undefined,
    documentOptions: DocumentOptions,
  ): ContextualStringOut;
}

export type Command = StaticCommand | ProgrammableCommand;

export type CommandOptionValue = string | number | boolean;

export type CommandOptions = Record<string, CommandOptionValue>;

export type EscapeStyle = (typeof EscapeStyles)[number];
