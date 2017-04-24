import { expect } from 'chai';
import {
  isPath,
  pathLookup
} from '../src/path.js';

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

describe('pathLookup', function() {
  it('should produce the expected results', function() {
    expect(pathLookup({ x: { y: [0, 2], z: 'foo' } }, ['x', 'y', 1])).to.equal(2);
    expect(pathLookup([3], [0])).to.equal(3);
    expect(pathLookup({ x: 3 }, ['x'])).to.equal(3);
    expect(pathLookup(3, [])).to.equal(3);
  });
});
