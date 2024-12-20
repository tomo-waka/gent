import { createToken, CstParser, Lexer } from "chevrotain";
import { EXPRESSION_BLOCK_END, EXPRESSION_BLOCK_START } from "../consts.js";

// region token

const LiteralBlock = createToken({
  name: "LiteralBlock",
  pattern: matchLiteralBlock,
  line_breaks: true,
});

const ExpressionBlock = createToken({
  name: "ExpressionBlock",
  pattern: matchExpressionBlock,
  line_breaks: false,
});

const allTokens = [ExpressionBlock, LiteralBlock];

// endregion

// region matcher

function matchLiteralBlock(text: string, startOffset: number): [string] | null {
  const endOffset = text.indexOf(EXPRESSION_BLOCK_START, startOffset);

  if (endOffset === -1) {
    return [text.substring(startOffset)];
  } else if (endOffset === startOffset) {
    return null;
  } else {
    let matchedString = text.substring(startOffset, endOffset);
    return [matchedString];
  }
}

function matchExpressionBlock(
  text: string,
  startOffset: number,
): [string] | null {
  for (let i = 0; i < EXPRESSION_BLOCK_START.length; i++) {
    if (text.at(i + startOffset) !== EXPRESSION_BLOCK_START.at(i)) {
      return null;
    }
  }

  const startOfBlockEnd = text.indexOf(EXPRESSION_BLOCK_END, startOffset);
  if (startOfBlockEnd === -1) {
    return null;
  }

  const endOffset = startOfBlockEnd + EXPRESSION_BLOCK_END.length;

  if (endOffset === startOffset) {
    return null;
  } else {
    let matchedString = text.substring(startOffset, endOffset);
    return [matchedString];
  }
}

// endregion

// region lexer

const lexer = new Lexer(allTokens);

export function lex(input: string) {
  const lexingResult = lexer.tokenize(input);

  if (lexingResult.errors.length > 0) {
    throw Error(
      `lexing errors detected
${lexingResult.errors[0]?.message}`,
    );
  }

  return lexingResult;
}

// endregion

// region parser

class TemplateParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public template = this.RULE("template", () => {
    this.MANY(() => {
      this.SUBRULE(this.templateFragment);
    });
  });

  private templateFragment = this.RULE("templateFragment", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.literalBlock) },
      { ALT: () => this.SUBRULE(this.expressionBlock) },
    ]);
  });

  private literalBlock = this.RULE("literalBlock", () => {
    this.CONSUME(LiteralBlock);
  });

  private expressionBlock = this.RULE("expressionBlock", () => {
    this.CONSUME(ExpressionBlock);
  });
}

export const templateParser = new TemplateParser();

// endregion
