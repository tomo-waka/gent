import { pickFirst } from "../../utils.js";
import { EXPRESSION_BLOCK_END, EXPRESSION_BLOCK_START } from "../consts.js";
import type { TemplateFragment } from "../types.js";
import { lex, templateParser } from "./templateParser.js";
import type {
  ExpressionBlockCstChildren,
  ICstNodeVisitor,
  LiteralBlockCstChildren,
  TemplateCstChildren,
  TemplateFragmentCstChildren,
} from "./templateParser_cst.js";

type Out = TemplateFragment | TemplateFragment[];

const emptyLiteralFragment = "";

const BaseVisitor = templateParser.getBaseCstVisitorConstructor<unknown, Out>();

class TemplateVisitor
  extends BaseVisitor
  implements ICstNodeVisitor<unknown, Out>
{
  constructor() {
    super();
    this.validateVisitor();
  }

  public template(children: TemplateCstChildren, param?: unknown): Out {
    const templateFragmentNodes = children.templateFragment;
    if (templateFragmentNodes === undefined) {
      return [emptyLiteralFragment];
    }
    return templateFragmentNodes.flatMap<TemplateFragment>(
      (templateFragmentNode) => this.visit(templateFragmentNode),
    );
  }

  public templateFragment(
    children: TemplateFragmentCstChildren,
    param?: unknown,
  ): Out {
    const literalBlockCstNode = pickFirst(children.literalBlock);
    const expressionBlockCstNode = pickFirst(children.expressionBlock);

    if (literalBlockCstNode !== undefined) {
      return this.visit(literalBlockCstNode);
    } else if (expressionBlockCstNode !== undefined) {
      return this.visit(expressionBlockCstNode);
    } else {
      return [];
    }
  }

  public literalBlock(children: LiteralBlockCstChildren, param?: unknown): Out {
    const literalBlockToken = pickFirst(children.LiteralBlock);
    if (literalBlockToken === undefined) {
      return [];
    }
    return literalBlockToken.image;
  }

  public expressionBlock(
    children: ExpressionBlockCstChildren,
    param?: unknown,
  ): Out {
    const expressionBlockToken = pickFirst(children.ExpressionBlock);
    if (expressionBlockToken === undefined) {
      return [];
    }

    const expressionBlock = expressionBlockToken.image;
    const expression = expressionBlock.substring(
      EXPRESSION_BLOCK_START.length,
      expressionBlock.length - EXPRESSION_BLOCK_END.length,
    );
    return {
      expression: expression,
    };
  }
}

const visitor = new TemplateVisitor();

export function toAstVisitor(input: string): Out {
  const lexResult = lex(input);
  templateParser.input = lexResult.tokens;
  const cst = templateParser.template();
  if (templateParser.errors.length > 0) {
    throw Error(
      "parsing errors detected!\n" + templateParser.errors[0]?.message,
    );
  }
  return visitor.visit(cst);
}
