import { expect } from 'chai';
import {
  isScalar
} from '../src/pojo.js';

describe('isScalar', function() {
  it('should categorize scalars as scalars', function() {
    expect(isScalar(5)).to.be.true;
    expect(isScalar(Infinity)).to.be.true;
    expect(isScalar(undefined)).to.be.true;
  });
});
