import { expect } from 'chai';
import {
  isScalar
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
    expect([1, function() { return 4; }]).to.be.false;
    expect([null, { x: new Promise(function(resolve) { resolve(null); }) }]).to.be.false;
  });
});

