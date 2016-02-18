import { createConstants } from './utils';

export default class Token {
  static Types = createConstants([
    'Number',
    'Keyword',
    'Identifier',
    'Operator',
    'Punctuation',
    'String',
  ]);

  static numberToken(value) { return new Token(Token.Types.Number, value); }
  static keywordToken(value) { return new Token(Token.Types.Keyword, value); }
  static identifierToken(value) { return new Token(Token.Types.Identifier, value); }
  static operatorToken(value) { return new Token(Token.Types.Operator, value); }
  static punctuationToken(value) { return new Token(Token.Types.Punctuation, value); }
  static stringToken(value) { return new Token(Token.Types.String, value); }

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
