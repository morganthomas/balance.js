import { expect } from 'chai';
import { prunePOJO, coprunePOJO } from '../src/prune-pojo.js';

describe('prunePOJO', function() {
  it('gives the expected results', function() {
    expect(prunePOJO(x => !!x, {
      a: null,
      b: false,
      c: undefined,
      d: NaN,
      e: 'foo',
      f: '',
      g: [],
      h: [0.0, 1.0, 'bar', { a: null, e: 'h', f: { } }],
      i: { x: { x: { y: [], z: { } } } }
    })).to.eql({
      e: 'foo',
      h: [1.0, 'bar', { e: 'h' }],
    });
  });
});

describe('coprunePOJO', function() {
  it('gives the expected results', function() {
    
  });
});

describe('prunePOJO and coprunePOJO', function() {
  it('behave like inverses of each other', function() {
    
  });
});
