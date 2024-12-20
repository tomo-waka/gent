import type { TypeTaggedStructure } from "../../types.js";
import type {
  CommandOptionValue,
  StructuredCommandExpression,
} from "../type.js";

export type CommandExpressionType =
  | "command"
  | "name"
  | "argument"
  | "option"
  | "option-key"
  | "option-value";

interface PrimitiveParsedCommandExpression extends TypeTaggedStructure {
  readonly type: CommandExpressionType;
}

export interface CommandExpressionFragment
  extends PrimitiveParsedCommandExpression,
    Omit<StructuredCommandExpression, "expression"> {
  readonly type: "command";
}

export interface CommandNameFragment extends PrimitiveParsedCommandExpression {
  readonly type: "name";
  readonly content: string;
}

export interface CommandArgumentFragment
  extends PrimitiveParsedCommandExpression {
  readonly type: "argument";
  readonly index: number;
  readonly content: string;
}

export interface CommandOptionFragment
  extends PrimitiveParsedCommandExpression {
  readonly type: "option";
  readonly key: string;
  readonly value: CommandOptionValue;
}

export interface CommandOptionKeyFragment
  extends PrimitiveParsedCommandExpression {
  readonly type: "option-key";
  readonly content: string;
}

export interface CommandOptionValueFragment
  extends PrimitiveParsedCommandExpression {
  readonly type: "option-value";
  readonly content: CommandOptionValue;
}

export type ParsedCommandExpression =
  | CommandExpressionFragment
  | CommandNameFragment
  | CommandArgumentFragment
  | CommandOptionFragment
  | CommandOptionKeyFragment
  | CommandOptionValueFragment;
