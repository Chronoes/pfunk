import TokenStream from '../../src/TokenStream';
import InputStream from '../../src/InputStream';
import Token from '../../src/Token';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
chai.use(spies);

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

  it('reads keywords', () => {
    const stream = new TokenStream(new InputStream('let'));
    expect(stream.readNext()).to.deep.equal(Token.keywordToken('let'));
  });

  it('reads identifiers', () => {
    const stream = new TokenStream(new InputStream('thisIsAVariableName'));
    expect(stream.readNext()).to.deep.equal(Token.identifierToken('thisIsAVariableName'));
  });

  it('reads floats', () => {
    const stream = new TokenStream(new InputStream('100.205'));
    expect(stream.readNext()).to.deep.equal(Token.numberToken(100.205));
  });

  it('fails the input when a float is incorrectly formatted', () => {
    const input = new InputStream('100.205.10');
    const failInput = chai.spy();
    input.fail = failInput;
    const stream = new TokenStream(input);
    expect(failInput).not.to.have.been.called;
    stream.readNext();
    expect(failInput).to.have.been.called.once;
  });

  it('reads integers', () => {
    const stream = new TokenStream(new InputStream('100'));
    expect(stream.readNext()).to.deep.equal(Token.numberToken(100));
  });

  it('skips whitespace', () => {
    const stream = new TokenStream(new InputStream('       \t \n 100'));
    expect(stream.readNext()).to.deep.equal(Token.numberToken(100));
  });

  it('reads strings', () => {
    const stream = new TokenStream(new InputStream('\'this is a string literal\''));
    expect(stream.readNext()).to.deep.equal(Token.stringToken('this is a string literal'));
  });
});
