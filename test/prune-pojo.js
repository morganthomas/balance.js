import { expect } from 'chai';
import { deepEquals } from '../src/pojo.js';
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

  it('even gives the predicate a path to work with', function() {
    expect(
      prunePOJO(
        (x, path) => !deepEquals(path, ['x', 'y']),
        {
          x: { y: 3 },
          z: true
        }))
      .to.eql({
        z: true
      });

    expect(
      prunePOJO(
        (x, path) => !([['a'], ['b','c'], ['c','a',1]].some(p2 => deepEquals(path, p2))),
        {
          a: 3,
          b: { c: true, d: 'foo' },
          c: { a: [0, 4, null] },
        }))
     .to.eql({
       b: { d: 'foo' },
       c: { a: [0, null] },
     });
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
