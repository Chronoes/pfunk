export default class InputStream {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 0;
    this.column = 0;
  }

  next() {
    const character = this.input.charAt(this.position++);
    if (character === '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    return character;
  }

  peek() {
    return this.input.charAt(this.position);
  }

  isNextEOF() {
    return this.peek() === '';
  }

  fail(message) {
    throw new Error(`${message} (${this.line}:${this.column})`);
  }
}
