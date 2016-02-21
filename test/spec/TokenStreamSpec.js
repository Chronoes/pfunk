import TokenStream from '../../src/TokenStream';
import Token from '../../src/Token';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
chai.use(spies);

const inputStreamMock = (input, start) => {
  let index = start || 0;
  return {
    input,
    isNextEOF: () => index === input.length,
    peek: () => input[index],
    next: () => input[index++],
  };
};

describe('TokenStream', () => {
  it('detects if a string is a keyword', () => {
    ['if', 'else', '=>', 'true', 'false', 'let'].forEach(keyword =>
      expect(TokenStream.isKeyword(keyword)).to.be.true
    );
    ['random', 'nottrue', 'test', '', 'lt'].forEach(notKeyword =>
      expect(TokenStream.isKeyword(notKeyword)).to.be.false
    );
  });

  it('detects if a string is a digit', () => {
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(digit =>
      expect(TokenStream.isDigit(digit)).to.be.true
    );
    ['a', 'y', ' ', '', ' 9', '8 ', ' 7 ', '12'].forEach(notDigit =>
      expect(TokenStream.isDigit(notDigit)).to.be.false
    );
  });

  it('detects if a string is an identifier', () => {
    ['hello', 'hello_underscore', 'someVariable'].forEach(identifier =>
      expect(TokenStream.isIdentifier(identifier)).to.be.true
    );
    ['swag life', '123', '', ' ', ' hi ', 'hi ', 'let', '"quotes"'].forEach(notIdentifier =>
      expect(TokenStream.isIdentifier(notIdentifier)).to.be.false
    );
  });

  it('detects if a string is an operator', () => {
    ['+', '-', '/', '%', '>', '<', '=', '&', '|'].forEach(operator =>
      expect(TokenStream.isOperator(operator)).to.be.true
    );
    ['', ' ', ' +', ' + ', '+ ', 'a', '++'].forEach(notOperator =>
      expect(TokenStream.isOperator(notOperator)).to.be.false
    );
  });

  it('detects if a string is punctuation', () => {
    ['.', ',', ';', '(', ')', '[', ']', '{', '}'].forEach(punctuation =>
      expect(TokenStream.isPunctuation(punctuation)).to.be.true
    );
    [' ', '', ' (', ') ', '()', ' ( '].forEach(notPunctuation =>
      expect(TokenStream.isPunctuation(notPunctuation)).to.be.false
    );
  });

  it('detects if a string is whitespace', () => {
    [' ', '\t', '\n', '\f', '\r', '\v'].forEach(whitespace =>
      expect(TokenStream.isWhitespace(whitespace)).to.be.true
    );
    ['', '(', 'a', '  ', ' \t'].forEach(notWhitespace =>
      expect(TokenStream.isWhitespace(notWhitespace)).to.be.false
    );
  });

  it('can peek the next token without advancing', () => {
    const stream = new TokenStream(inputStreamMock('let thing'));
    expect(stream.peek()).to.deep.equal(Token.keywordToken('let'));
    expect(stream.next()).to.deep.equal(Token.keywordToken('let'));
  });

  context('#next()', () => {
    it('reads keywords', () => {
      const stream = new TokenStream(inputStreamMock('let'));
      expect(stream.next()).to.deep.equal(Token.keywordToken('let'));
    });

    it('reads identifiers', () => {
      const stream = new TokenStream(inputStreamMock('thisIsAVariableName'));
      expect(stream.next()).to.deep.equal(Token.identifierToken('thisIsAVariableName'));
    });

    it('reads floats', () => {
      const stream = new TokenStream(inputStreamMock('100.205'));
      expect(stream.next()).to.deep.equal(Token.numberToken(100.205));
    });

    it('fails the input when a float is incorrectly formatted', () => {
      const input = inputStreamMock('100.205.10');
      const failInput = chai.spy();
      input.fail = failInput;
      const stream = new TokenStream(input);
      expect(failInput).not.to.have.been.called;
      stream.next();
      expect(failInput).to.have.been.called.once;
    });

    it('reads integers', () => {
      const stream = new TokenStream(inputStreamMock('100'));
      expect(stream.next()).to.deep.equal(Token.numberToken(100));
    });

    it('skips whitespace', () => {
      const stream = new TokenStream(inputStreamMock('       \t \n 100'));
      expect(stream.next()).to.deep.equal(Token.numberToken(100));
    });

    it('reads strings', () => {
      const stream = new TokenStream(inputStreamMock('\'this is a string literal\''));
      expect(stream.next()).to.deep.equal(Token.stringToken('this is a string literal'));
    });

    it('reads punctuation', () => {
      const stream = new TokenStream(inputStreamMock(';'));
      expect(stream.next()).to.deep.equal(Token.punctuationToken(';'));
    });

    it('reads multiple different tokens in order', () => {
      const stream = new TokenStream(inputStreamMock('let thing = 500'));
      expect(stream.next()).to.deep.equal(Token.keywordToken('let'));
      expect(stream.next()).to.deep.equal(Token.identifierToken('thing'));
      expect(stream.next()).to.deep.equal(Token.operatorToken('='));
      expect(stream.next()).to.deep.equal(Token.numberToken(500));
    });
  });

  context('#readWhile()', () => {
    it('should return a string while predicate is true', () => {
      const input = '    let it = go;';
      let index = 0;
      const stream = new TokenStream({
        isNextEOF: () => false,
        peek: () => input[index],
        next: () => input[index++],
      });

      expect(stream.readWhile(char => char === ' ')).to.equal('    ');
      expect(index).to.equal(4);
    });

    it('should return a string if EOF is reached', () => {
      const stream = new TokenStream(inputStreamMock('somerandomtext'));
      expect(stream.readWhile(char => /[a-z]/.test(char))).to.equal('somerandomtext');
    });
  });

  context('#readNumber()', () => {
    it('should return an integer token from a valid string', () => {
      const stream = new TokenStream(inputStreamMock('420 blaze it'));
      expect(stream.readNumber()).to.deep.equal(Token.numberToken(420));
    });

    it('should return a float token from a valid string', () => {
      const stream = new TokenStream(inputStreamMock('3.14 pie'));

      expect(stream.readNumber()).to.deep.equal(Token.numberToken(3.14));
    });
  });

  context('#readIdentifier()', () => {
    it('should return an identifier token from a valid string', () => {
      const stream = new TokenStream(inputStreamMock('__iAmASilly_identifier__'));
      expect(stream.readIdentifier()).to.deep.equal(
        Token.identifierToken('__iAmASilly_identifier__')
      );
    });

    it('should return a keyword token from a valid string', () => {
      const stream = new TokenStream(inputStreamMock('let aNumber = 5;'));
      expect(stream.readIdentifier()).to.deep.equal(Token.keywordToken('let'));
    });
  });

  context('#readEscaped()', () => {
    it('should return a string surrounded by a given character', () => {
      const stream = new TokenStream(inputStreamMock(`"This' a proper string, m8!\n".length != 3`));
      expect(stream.readEscaped('"')).to.equal(`This' a proper string, m8!\n`);
    });
  });

  context('#readString()', () => {
    it('should return a string token surrounded by single quotes', () => {
      const stream = new TokenStream(
        inputStreamMock(`'This is a proper string, m8!\n\\DOMAIN\\USER'.length > 0`)
      );
      expect(stream.readString()).to.deep.equal(
        Token.stringToken('This is a proper string, m8!\n\\DOMAIN\\USER')
      );
    });
  });

  context('#skipLine()', () => {
    it('should skip a whole line', () => {
      const stream = new TokenStream(inputStreamMock(`let me = free;\n# a comment?`));
      expect(stream.input.peek()).to.equal('l');
      stream.skipLine();
      expect(stream.input.peek()).to.equal('#');
    });
  });
});
