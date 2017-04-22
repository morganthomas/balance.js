import { expect } from 'chai';
import {
  isScalar
} from '../src/pojo.js';

describe('isScalar', function() {
  it('should categorize scalars as scalars', function() {
    expect(isScalar(5)).to.be.true;
    expect(isScalar(-Infinity)).to.be.true;
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
