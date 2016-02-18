import { createConstants } from '../../src/utils';
import { expect } from 'chai';

describe('utils', () => {
  it('can create constants', () => {
    const constants = createConstants(['first', 'second', 'third']);
    expect(constants).to.deep.equal({
      first: 'first',
      second: 'second',
      third: 'third',
    });
  });
});
