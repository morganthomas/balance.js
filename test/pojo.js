import { expect } from 'chai';
import {
  isScalar,
  isPOJO,
  isPONJO,
  isPONuNJO,
  POJOsAreStructurallyCongruent,
} from '../src/pojo.js';

describe('isScalar', function() {
  it('should categorize scalars as scalars', function() {
    expect(isScalar(5)).to.be.true;
    expect(isScalar(-Infinity)).to.be.true;
    expect(isScalar(NaN)).to.be.true;
    expect(isScalar(undefined)).to.be.true;
    expect(isScalar(null)).to.be.true;
    expect(isScalar('')).to.be.true;
    expect(isScalar('foobar')).to.be.true;
  });

  it('should categorize non-scalars as non-scalars', function() {
    expect(isScalar({})).to.be.false;
    expect(isScalar([])).to.be.false;
    expect(isScalar({ x: 5 })).to.be.false;
    expect(isScalar([1])).to.be.false;
    expect(isScalar(function() { return 5; })).to.be.false;
    expect(isScalar(new Promise(function(resolve, reject) { resolve(1); }))).to.be.false;
  });
});

describe('isPOJO', function() {
  it('should categorize POJOs as POJOs', function() {
    expect(isPOJO(5)).to.be.true;
    expect(isPOJO(Infinity)).to.be.true;
    expect(isPOJO(NaN)).to.be.true;
    expect(isPOJO(undefined)).to.be.true;
    expect(isPOJO(null)).to.be.true;
    expect(isPOJO('')).to.be.true;
    expect(isPOJO('foobar')).to.be.true;
    expect(isPOJO({})).to.be.true;
    expect(isPOJO([])).to.be.true;
    expect(isPOJO({ x: 5 })).to.be.true;
    expect(isPOJO({ x: { y: 5, z: false } })).to.be.true;
    expect(isPOJO([{ abc: 'foobar' }, 13, undefined])).to.be.true;
  });

  it('should categorize straightforward non-POJOs as non-POJOs', function() {
    expect(isPOJO(function() { return 4; })).to.be.false;
    expect(isPOJO([1, function() { return 4; }])).to.be.false;
    expect(isPOJO([null, { x: new Promise(function(resolve) { resolve(null); }) }])).to.be.false;
  });

  it('should categorize objects with interesting prototypes as non-POJOs', function() {
    function InterestingCtor() {
      this.foo = 5;
    }

    InterestingCtor.prototype = {
      y: 6
    };

    var interesting = new InterestingCtor();
    expect(interesting.foo).to.equal(5);
    expect(interesting.y).to.equal(6);

    expect(isPOJO(interesting)).to.be.false;
  });
});

describe('isPONJO', function() {
  it('should categorize PONJOs as PONJOs', function() {
    expect(isPONJO(5)).to.be.true;
    expect(isPONJO([])).to.be.true;
    expect(isPONJO({})).to.be.true;
    expect(isPONJO({ x: 5 })).to.be.true;
    expect(isPONJO({ x: { y: 0.13, z: [0.0, { x: -13.5 }] } })).to.be.true;
  });

  it('should categorize non-PONJOs as non-PONJOs', function() {
    expect(isPONJO(Infinity)).to.be.false;
    expect(isPONJO(-Infinity)).to.be.false;
    expect(isPONJO(NaN)).to.be.false;
    expect(isPONJO(null)).to.be.false;
    expect(isPONJO(undefined)).to.be.false;
    expect(isPONJO({ x: 'foo', y: 7 })).to.be.false;
    expect(isPONJO([{ x: 5 }, function() { return 5; }])).to.be.false;
    expect(isPONJO(new Promise(function(resolve) { resolve(2); }))).to.be.false;
    expect(isPONJO([0.0, Infinity, 3.0])).to.be.false;
  });
});

describe('isPONuNJO', function() {
  it('should categorize PONuNJOs as PONuNJOs', function() {
    expect(isPONuNJO(null)).to.be.true;
    expect(isPONuNJO(5)).to.be.true;
    expect(isPONuNJO([])).to.be.true;
    expect(isPONuNJO({})).to.be.true;
    expect(isPONuNJO({ x: 5 })).to.be.true;
    expect(isPONuNJO({ x: { y: null, z: [0.0, null, { x: -13.5 }] } })).to.be.true;
  });

  it('should categorize non-PONuNJOs as non-PONuNJOs', function() {
    expect(isPONuNJO(Infinity)).to.be.false;
    expect(isPONuNJO(-Infinity)).to.be.false;
    expect(isPONuNJO(NaN)).to.be.false;
    expect(isPONuNJO(undefined)).to.be.false;
    expect(isPONuNJO({ x: undefined, y: 7 })).to.be.false;
    expect(isPONuNJO([{ x: 5 }, function() { return 5; }])).to.be.false;
    expect(isPONuNJO(new Promise(function(resolve) { resolve(2); }))).to.be.false;
    expect(isPONuNJO([0.0, Infinity, 3.0])).to.be.false;
  });
});

describe('POJOsAreStructurallyCongruent', function() {
  it('should categorize congruent pairs as congruent', function() {
    expect(POJOsAreStructurallyCongruent(5, 'foo')).to.be.true;
    expect(POJOsAreStructurallyCongruent(NaN, undefined)).to.be.true;
    expect(POJOsAreStructurallyCongruent([], [])).to.be.true;
    expect(POJOsAreStructurallyCongruent({}, {})).to.be.true;
    expect(POJOsAreStructurallyCongruent({ x : 5 }, { x: null })).to.be.true;
    expect(POJOsAreStructurallyCongruent([1, 3, 5], ["foo", 3, null])).to.be.true;
    expect(POJOsAreStructurallyCongruent({ x: { y: [null, undefined], z: null } }, { x: { y: ['foo', 5], z: 'bar' } })).to.be.true;
  });

  it('should categorize non-congruent pairs as non-congruent', function() {
    expect(POJOsAreStructurallyCongruent(4, [])).to.be.false;
    expect(POJOsAreStructurallyCongruent([], null)).to.be.false;
    expect(POJOsAreStructurallyCongruent({}, Infinity)).to.be.false;
    expect(POJOsAreStructurallyCongruent({}, [])).to.be.false;
    expect(POJOsAreStructurallyCongruent({ x: 4 }, { y: 4 })).to.be.false;
    expect(POJOsAreStructurallyCongruent({ x: 4, y : 4 }, { x : 4 })).to.be.false;
    expect(POJOsAreStructurallyCongruent([1], [1, 2])).to.be.false;
    expect(POJOsAreStructurallyCongruent([1, 2, { x : 5 }], [1, 2, 5])).to.be.false;
    expect(POJOsAreStructurallyCongruent({ x: null }, { x: [] })).to.be.false;
  });
});
