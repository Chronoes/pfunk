import Token from '../../src/Token';
import { expect } from 'chai';

describe('Token', () => {
  it('has a type and a value', () => {
    const type = 'SomeTokenType';
    const value = 'a token value';
    const token = new Token(type, value);
    expect(token.type).to.equal(type);
    expect(token.value).to.equal(value);
  });

  it('creates number tokens', () => {
    const value = 123;
    const token = Token.numberToken(value);
    expect(token.type).to.equal(Token.Types.Number);
    expect(token.value).to.equal(value);
  });

  it('creates keyword tokens', () => {
    const value = 'let';
    const token = Token.keywordToken(value);
    expect(token.type).to.equal(Token.Types.Keyword);
    expect(token.value).to.equal(value);
  });

  it('creates identifier tokens', () => {
    const value = 'anIdentifier';
    const token = Token.identifierToken(value);
    expect(token.type).to.equal(Token.Types.Identifier);
    expect(token.value).to.equal(value);
  });

  it('creates operator tokens', () => {
    const value = '+';
    const token = Token.operatorToken(value);
    expect(token.type).to.equal(Token.Types.Operator);
    expect(token.value).to.equal(value);
  });

  it('creates punctuation tokens', () => {
    const value = '{';
    const token = Token.punctuationToken(value);
    expect(token.type).to.equal(Token.Types.Punctuation);
    expect(token.value).to.equal(value);
  });

  it('creates string tokens', () => {
    const value = 'a string value';
    const token = Token.stringToken(value);
    expect(token.type).to.equal(Token.Types.String);
    expect(token.value).to.equal(value);
  });
});
