import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface TemplateCstNode extends CstNode {
  name: "template";
  children: TemplateCstChildren;
}

export type TemplateCstChildren = {
  templateFragment?: TemplateFragmentCstNode[];
};

export interface TemplateFragmentCstNode extends CstNode {
  name: "templateFragment";
  children: TemplateFragmentCstChildren;
}

export type TemplateFragmentCstChildren = {
  literalBlock?: LiteralBlockCstNode[];
  expressionBlock?: ExpressionBlockCstNode[];
};

export interface LiteralBlockCstNode extends CstNode {
  name: "literalBlock";
  children: LiteralBlockCstChildren;
}

export type LiteralBlockCstChildren = {
  LiteralBlock: IToken[];
};

export interface ExpressionBlockCstNode extends CstNode {
  name: "expressionBlock";
  children: ExpressionBlockCstChildren;
}

export type ExpressionBlockCstChildren = {
  ExpressionBlock: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  template(children: TemplateCstChildren, param?: IN): OUT;

  templateFragment(children: TemplateFragmentCstChildren, param?: IN): OUT;

  literalBlock(children: LiteralBlockCstChildren, param?: IN): OUT;

  expressionBlock(children: ExpressionBlockCstChildren, param?: IN): OUT;
}
