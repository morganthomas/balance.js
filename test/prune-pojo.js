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

    expect(prunePOJO({
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
      a: null,
      b: false,
      c: undefined,
      d: NaN,
      e: 'foo',
      f: '',
      h: [0.0, 1.0, 'bar', { a: null, e: 'h' }],
    });

    expect(prunePOJO(x => !!x, undefined)).to.equal(undefined);
    expect(prunePOJO(x => !!x, 4)).to.equal(4);
  });
});

describe('coprunePOJO', function() {
  it('gives the expected results', function() {
    expect(coprunePOJO(x => !!x, {
      a: null,
      b: false,
      c: undefined,
      d: NaN,
      e: 'foo',
      f: '',
      g: [],
      h: [0.0, 1.0, 'bar', { a: null, e: 'h', f: { } }],
      i: { x: { x: { y: [], z: { } } } }
    }, {
      e: 'baz',
      h: [8.0, 'bletch', { e: undefined }],
    })).to.eql({
      a: null,
      b: false,
      c: undefined,
      d: NaN,
      e: 'baz',
      f: '',
      g: [],
      h: [0.0, 8.0, 'blench', { a: null, e: undefined, f: { } }],
      i: { x: { x: { y: [], z: { } } } }
    });
  });
});

describe('prunePOJO and coprunePOJO', function() {
  it('behave like inverses of each other', function() {
    
  });
});
