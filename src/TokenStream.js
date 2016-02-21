import Token from './Token';

export default class TokenStream {
  static keywords = ['if', 'else', '=>', 'true', 'false', 'let'];

  static keywordPattern = new RegExp(`^(${TokenStream.keywords.join('|')})$`);
  static digitPattern = /^\d$/;
  static identifierPattern = /^[a-z_]+$/i;
  static operatorPattern = /^(\+|-|\*|\/|%|=|&|\||<|>|!)$/;
  static punctuationPattern = /^(\.|,|;|\(|\)|{|}|\[|\])$/;
  static whitespacePattern = /^\s$/;

  constructor(input) {
    this.input = input;
    this.current = null;
  }

  static isKeyword(characters) { return TokenStream.keywordPattern.test(characters); }
  static isDigit(characters) { return TokenStream.digitPattern.test(characters); }
  static isIdentifier(characters) {
    return TokenStream.identifierPattern.test(characters) && !TokenStream.isKeyword(characters);
  }
  static isOperator(characters) { return TokenStream.operatorPattern.test(characters); }
  static isPunctuation(characters) { return TokenStream.punctuationPattern.test(characters); }
  static isWhitespace(characters) { return TokenStream.whitespacePattern.test(characters); }

  readWhile(predicate) {
    let characters = '';
    while (!this.input.isNextEOF() && predicate(this.input.peek())) {
      characters += this.input.next();
    }
    return characters;
  }

  readNumber() {
    let hasDot = false;
    const number = this.readWhile(character => {
      if (character === '.') {
        if (hasDot) {
          this.input.fail('Unexpected dot in number');
        }
        hasDot = true;
        return true;
      }
      return TokenStream.isDigit(character);
    });
    return Token.numberToken(parseFloat(number, 10));
  }

  readIdentifier() {
    const identifier = this.readWhile(TokenStream.isIdentifier);
    const tokenType = TokenStream.isKeyword(identifier) ?
      Token.keywordToken : Token.identifierToken;
    return tokenType(identifier);
  }

  readEscaped(to) {
    let escaped = false;
    let characters = '';
    this.input.next();
    while (!this.input.isNextEOF()) {
      const character = this.input.next();
      if (escaped) {
        characters += `\\${character}`;
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === to) {
        break;
      } else {
        characters += character;
      }
    }
    return characters;
  }

  readString() {
    return Token.stringToken(this.readEscaped(`'`));
  }

  skipLine() {
    this.readWhile(character => character !== '\n');
    this.input.next();
  }

  readNext() {
    this.readWhile(TokenStream.isWhitespace);
    if (this.input.isNextEOF()) {
      return null;
    }
    const character = this.input.peek();
    if (character === '#') {
      this.skipLine();
      return this.readNext();
    } else if (character === `'`) {
      return this.readString();
    } else if (TokenStream.isDigit(character)) {
      return this.readNumber();
    } else if (TokenStream.isIdentifier(character)) {
      return this.readIdentifier();
    } else if (TokenStream.isPunctuation(character)) {
      return Token.punctuationToken(this.input.next());
    } else if (TokenStream.isOperator(character)) {
      return Token.operatorToken(this.readWhile(TokenStream.isOperator));
    }
    this.input.fail(`Error while reading character: ${character}, don't know how to process`);
  }

  peek() {
    if (!this.current) {
      this.current = this.readNext();
    }
    return this.current;
  }

  next() {
    const token = this.current;
    this.current = null;
    if (token) {
      return token;
    }
    return this.readNext();
  }

  isNextEOF() {
    return this.peek() === null;
  }
}
