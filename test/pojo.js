import { expect } from 'chai';
import {
  isScalar
} from '../src/pojo.js';

describe('isScalar', function() {
  expect(isScalar(5)).to.be.true;
});
