import TokenStream from '../../src/TokenStream';
import { expect } from 'chai';

describe('TokenStream', () => {
  it('can detect if a string is a keyword', () => {
    ['if', 'else', '=>', 'true', 'false', 'let'].forEach(keyword =>
      expect(TokenStream.isKeyword(keyword)).to.be.true
    );
    expect(TokenStream.isKeyword('random')).to.be.false;
    expect(TokenStream.isKeyword('nottrue')).to.be.false;
    expect(TokenStream.isKeyword('')).to.be.false;
  });

  it('can detect if a string is a digit', () => {
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(digit =>
      expect(TokenStream.isDigit(digit)).to.be.true
    );
    expect(TokenStream.isDigit('a')).to.be.false;
    expect(TokenStream.isDigit('y')).to.be.false;
    expect(TokenStream.isDigit('')).to.be.false;
    expect(TokenStream.isDigit(' ')).to.be.false;
    expect(TokenStream.isDigit(' 9')).to.be.false;
    expect(TokenStream.isDigit('8 ')).to.be.false;
    expect(TokenStream.isDigit(' 8 ')).to.be.false;
    expect(TokenStream.isDigit('89')).to.be.false;
  });

  it('can detect if a string is an identifier', () => {
    expect(TokenStream.isIdentifier('hello')).to.be.true;
    expect(TokenStream.isIdentifier('hello_underscore')).to.be.true;
    expect(TokenStream.isIdentifier('someVariable')).to.be.true;
    expect(TokenStream.isIdentifier('swag life')).to.be.false;
    expect(TokenStream.isIdentifier('123')).to.be.false;
    expect(TokenStream.isIdentifier('')).to.be.false;
    expect(TokenStream.isIdentifier(' ')).to.be.false;
    expect(TokenStream.isIdentifier(' hi')).to.be.false;
    expect(TokenStream.isIdentifier('hi ')).to.be.false;
    expect(TokenStream.isIdentifier('let')).to.be.false;
    expect(TokenStream.isIdentifier('"quotes"')).to.be.false;
  });

  it('can detect if a string is an operator', () => {
    ['+', '-', '/', '%', '>', '<', '=', '&', '|'].forEach(operator =>
      expect(TokenStream.isOperator(operator)).to.be.true
    );
    expect(TokenStream.isOperator('')).to.be.false;
    expect(TokenStream.isOperator(' ')).to.be.false;
    expect(TokenStream.isOperator(' +')).to.be.false;
    expect(TokenStream.isOperator(' + ')).to.be.false;
    expect(TokenStream.isOperator('+ ')).to.be.false;
    expect(TokenStream.isOperator('a')).to.be.false;
    expect(TokenStream.isOperator('++')).to.be.false;
  });

  it('can detect if a string is punctuation', () => {
    ['.', ',', ';', '(', ')', '[', ']', '{', '}'].forEach(punctuation =>
      expect(TokenStream.isPunctuation(punctuation)).to.be.true
    );
    expect(TokenStream.isPunctuation(' ')).to.be.false;
    expect(TokenStream.isPunctuation('')).to.be.false;
    expect(TokenStream.isPunctuation(' (')).to.be.false;
    expect(TokenStream.isPunctuation(') ')).to.be.false;
    expect(TokenStream.isPunctuation('()')).to.be.false;
    expect(TokenStream.isPunctuation(' ( ')).to.be.false;
  });

  it('can detect if a string is whitespace', () => {
    [' ', '\t', '\n', '\f', '\r', '\v'].forEach(whitespace =>
      expect(TokenStream.isWhitespace(whitespace)).to.be.true
    );
    expect(TokenStream.isWhitespace('')).to.be.false;
    expect(TokenStream.isWhitespace('(')).to.be.false;
    expect(TokenStream.isWhitespace('a')).to.be.false;
    expect(TokenStream.isWhitespace('  ')).to.be.false;
    expect(TokenStream.isWhitespace(' \t')).to.be.false;
  });
});
