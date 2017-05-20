import { expect } from 'chai';
import {
  isPath,
  getAtPath,
  setAtPath,
} from '../../src/path.js';

describe('isPath', function() {
  it('should classify paths as paths', function() {
    expect(isPath([])).to.be.true;
    expect(isPath([0])).to.be.true;
    expect(isPath([3])).to.be.true;
    expect(isPath(['a',3])).to.be.true;
    expect(isPath(['a'])).to.be.true;
    expect(isPath(['a','b','c'])).to.be.true;
  });

  it('should classify non-paths as non-paths', function() {
    expect(isPath({})).to.be.false;
    expect(isPath(undefined)).to.be.false;
    expect(isPath(null)).to.be.false;
    expect(isPath(3)).to.be.false;
    expect(isPath('foo')).to.be.false;
    expect(isPath({ a: 3 })).to.be.false;
    expect(isPath(['a', []])).to.be.false;
    expect(isPath([{ a: 3 }])).to.be.false;
  });
});

describe('getAtPath', function() {
  it('should produce the expected results', function() {
    expect(getAtPath({ x: { y: [0, 2], z: 'foo' } }, ['x', 'y', 1])).to.equal(2);
    expect(getAtPath([3], [0])).to.equal(3);
    expect(getAtPath({ x: 3 }, ['x'])).to.equal(3);
    expect(getAtPath(3, [])).to.equal(3);
  });
});

describe('setAtPath', function() {
  let testObject = {
    a: 0,
    b: ['a', 1]
  };

  let testArray = [[{ a: { a: 'bar' }}], 'a'];

  it('works on some cases', function() {
    setAtPath(testObject, ['a'], 5);
    setAtPath(testObject, ['b', 0], 'foo');
    setAtPath(testObject, ['b', 1], null);
    setAtPath(testArray, [0, 0, 'a', 'a'], NaN);
    expect(testObject.a).to.equal(5);
    expect(testObject.b[0]).to.equal('foo');
    expect(testObject.b[1]).to.equal(null);
    expect(isNaN(testArray[0][0].a.a)).to.be.true;
  });
});
