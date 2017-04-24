import { expect } from 'chai';
import { arrayToPathSet, pathSetContains, pathSetToArray } from '../src/path-set.js';

describe('arrayToPathSet', function() {
  it('gives expected outputs', function() {
    expect(arrayToPathSet([])).to.eql({});
    expect(arrayToPathSet([['a']])).to.eql({ a: true });
    expect(arrayToPathSet([['a'],['b']])).to.eql({ a: true, b: true });
    expect(arrayToPathSet([['a'],['a',0]])).to.eql({ a: [true, { 0: true }] });
    expect(arrayToPathSet([['a'],['a',0],['a','b'],['c']]))
      .to.eql({ a: [true, { 0: true, b: true }], c: true });
    expect(arrayToPathSet([['a'],['a','a'],['a','a','a']]))
      .to.eql({ a: [true, { a: [true, { a: true }] }] });
    expect(arrayToPathSet([['a','b']]))
      .to.eql({ a: [false, { b: true }] });
    expect(arrayToPathSet([['a','b'],['a','c'],['a','b','c']]))
      .to.eql({ a: [false, { b: [true, { c: true }], c: true }] });
  });
});

let testPathArrays = [
  [],
  [['a']],
  [['a'],['a',0]],
  [['a'],['a',0],['a','b'],['c']],
  [['a','b']],
  [['a','b'],['a','b','c'],['a','c']],
];

describe('pathSetContains', function() {
  let testPathSets = testPathArrays.map(arrayToPathSet);

  it('rules in the stuff that should be in', function() {
    for (let i = 0; i < testPathArrays.length; i++) {
      let array = testPathArrays[i];
      let set = testPathSets[i];
      array.forEach(el => expect(pathSetContains(set, el)));
    }
  });

  it('rules out stuff that should be out', function() {
    let set = testPathSets[0];
    expect(pathSetContains(set, [0])).to.be.false;
    set = testPathSets[1];
    expect(pathSetContains(set, ['b'])).to.be.false;
    set = testPathSets[5];
    expect(pathSetContains(set, ['a'])).to.be.false;
  });
});

describe('pathSetToArray', function() {
  it('works on some simple cases', function() {
    expect(pathSetToArray({})).to.eql([]);
    expect(pathSetToArray({ a: true })).to.eql([['a']]);
    expect(pathSetToArray({ a: [true, { b: true }] })).to.eql([['a'],['a','b']]);
  });

  it('inverts arrayToPathSet', function() {
    testPathArrays.forEach(array => expect(pathSetToArray(arrayToPathSet(array))).to.eql(array));
  });
});
