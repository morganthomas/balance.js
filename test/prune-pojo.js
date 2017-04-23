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
        (x, path) => !deepEquals(path, ['x', 'y']),
        {
          x: { y: { z: 3 } },
          z: true
        }))
      .to.eql({
        z: true
      });

    expect(
      prunePOJO(
        (x, path) => !deepEquals(path, ['x', 'y']),
        {
          x: { y: [3] },
          z: true
        }))
      .to.eql({
        z: true
      });

    let pathPredicate = (x, path) => !(
        deepEquals(path, ['a']) ||
        deepEquals(path, ['b', 'c']) ||
        deepEquals(path, ['c', 'a', 1])
    );
    expect(pathPredicate(true, ['b', 'c'])).to.be.false;
    expect(pathPredicate('foo', ['b', 'd'])).to.be.true;
    
    expect(
      prunePOJO(
        pathPredicate,
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
      h: [0.0, 8.0, 'bletch', { a: null, e: undefined, f: { } }],
      i: { x: { x: { y: [], z: { } } } }
    });

    let tc2predicate = (x, path) =>
        !(x === null || path === ['d',1] || path === ['c'] || path === ['e',0,'a'] || path === ['f',0,'a']);

    let tc2original = {
        a: null,
        b: [null, null, { a: null, x: 3, y: true, z: undefined }, 13],
        c: { a: 5, b: 7 },
        d: [0, 5, null],
        e: [{ a: { z: 8 }, b: 7 }, 13],
        f: [{ a: 8, b: 7 }, 13],
    };

    let tc2pruned = {
      b: [{ x: 'x', y: true, z: undefined }, 'b'],
      d: [NaN],
      e: [{ b: { a: 'a' } }, []],
      f: [{ b: 7 }, 13],
    }

    expect(coprunePOJO(tc2predicate, tc2original, tc2pruned)).to.equl({
        a: null,
        b: [null, null, { a: null, x: 'x', y: true, z: undefined }, 'b'],
        c: { a: 5, b: 7 },
        d: [NaN, 5, null],
        e: [{ a: { z: 8 }, b: { a: 'a' } }, []],
        f: [{ a: 8, b: 7 }, 13],
      });
  });
});
