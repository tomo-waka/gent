import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface CommandExpressionCstNode extends CstNode {
  name: "commandExpression";
  children: CommandExpressionCstChildren;
}

export type CommandExpressionCstChildren = {
  commandName: CommandNameCstNode[];
  commandOption?: CommandOptionCstNode[];
};

export interface CommandNameCstNode extends CstNode {
  name: "commandName";
  children: CommandNameCstChildren;
}

export type CommandNameCstChildren = {
  Identifier: IToken[];
};

export interface CommandOptionCstNode extends CstNode {
  name: "commandOption";
  children: CommandOptionCstChildren;
}

export type CommandOptionCstChildren = {
  commandOptionKey: CommandOptionKeyCstNode[];
  commandOptionValue?: CommandOptionValueCstNode[];
};

export interface CommandOptionKeyCstNode extends CstNode {
  name: "commandOptionKey";
  children: CommandOptionKeyCstChildren;
}

export type CommandOptionKeyCstChildren = {
  CommandOptionKey: IToken[];
};

export interface CommandOptionValueCstNode extends CstNode {
  name: "commandOptionValue";
  children: CommandOptionValueCstChildren;
}

export type CommandOptionValueCstChildren = {
  Identifier?: IToken[];
  NumberLiteral?: IToken[];
  Literal?: IToken[];
  QuotedLiteral?: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  commandExpression(children: CommandExpressionCstChildren, param?: IN): OUT;
  commandName(children: CommandNameCstChildren, param?: IN): OUT;
  commandOption(children: CommandOptionCstChildren, param?: IN): OUT;
  commandOptionKey(children: CommandOptionKeyCstChildren, param?: IN): OUT;
  commandOptionValue(children: CommandOptionValueCstChildren, param?: IN): OUT;
}
