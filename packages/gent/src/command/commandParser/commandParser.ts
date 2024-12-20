import { createToken, CstParser, Lexer } from "chevrotain";

// region token

const Literal = createToken({
  name: "Literal",
  pattern: /[^-"\s]+/,
  line_breaks: false,
});

const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /[0-9]+/,
  longer_alt: [Literal],
  line_breaks: false,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z][a-zA-Z0-9.]*/,
  longer_alt: [Literal],
  line_breaks: false,
});

const QuotedLiteral = createToken({
  name: "QuotedLiteral",
  pattern: /"(?:[^\\"]|\\[nrt\\])*"/,
  line_breaks: false,
});

const CommandOptionKey = createToken({
  name: "CommandOptionKey",
  pattern: /(-[a-zA-Z])|(--[a-zA-Z]+)/,
  line_breaks: false,
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,
  Identifier,
  NumberLiteral,
  Literal,
  QuotedLiteral,
  CommandOptionKey,
];

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

export class CommandParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public commandExpression = this.RULE("commandExpression", () => {
    this.SUBRULE(this.commandName);
    this.MANY(() => {
      this.SUBRULE(this.commandOption);
    });
  });

  public commandName = this.RULE("commandName", () => {
    this.CONSUME(Identifier);
  });

  public commandOption = this.RULE("commandOption", () => {
    this.SUBRULE(this.commandOptionKey);
    this.OPTION(() => {
      this.SUBRULE(this.commandOptionValue);
    });
  });

  public commandOptionKey = this.RULE("commandOptionKey", () => {
    this.CONSUME(CommandOptionKey);
  });

  public commandOptionValue = this.RULE("commandOptionValue", () => {
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(Literal) },
      { ALT: () => this.CONSUME(QuotedLiteral) },
    ]);
  });
}

export const commandParser = new CommandParser();

// endregion
