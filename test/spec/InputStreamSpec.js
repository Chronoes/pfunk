import InputStream from '../../src/InputStream';
import { expect } from 'chai';

describe('InputStream', () => {
  it('iterates over characters', () => {
    const stream = new InputStream('a sd');
    expect(stream.next()).to.equal('a');
    expect(stream.next()).to.equal(' ');
    expect(stream.next()).to.equal('s');
    expect(stream.next()).to.equal('d');
    expect(stream.next()).to.equal('');
  });

  it('peeks characters without iterating', () => {
    const stream = new InputStream('asd');
    expect(stream.next()).to.equal('a');
    expect(stream.peek()).to.equal('s');
    expect(stream.next()).to.equal('s');
    expect(stream.next()).to.equal('d');
  });

  it('tells you if it has characters left', () => {
    const stream = new InputStream('a');
    expect(stream.isNextEOF()).to.be.false;
    expect(stream.next()).to.equal('a');
    expect(stream.isNextEOF()).to.be.true;
  });

  it('can fail with a message, informing you of the line and column number', () => {
    const stream = new InputStream('a\nsd');
    stream.next();
    stream.next();
    stream.next();
    stream.next();
    expect(stream.fail.bind(stream, 'failedasd')).to.throw(/(failedasd){1}.*1{1}.*2{1}/g);
  });
});
