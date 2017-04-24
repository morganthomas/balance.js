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
