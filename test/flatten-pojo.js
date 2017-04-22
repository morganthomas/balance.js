import { expect } from 'chai';
import { flattenPOJO, unflattenPOJO } from '../src/flatten-pojo.js';

describe('flattenPOJO', function() {
  it('should produce the expected output', function() {
    for (let i = 0; i < testPojos.length; i++) {
      expect(flattenPOJO(testPojos[i])).to.eql(testPojosFlattened[i]);
    }
  });
});

describe('flattenPOJO and unflattenPOJO', function() {
  it('should be inverses of each other', function() {
    testPojos.forEach(function(pojo) {
      let flattened = flattenPOJO(pojo);
      let unflattened = unflattenPOJO(pojo, flattened);
      expect(unflattened).to.eql(pojo);
    });
  });
});

const testPojos = [
  4,
  undefined,
  NaN,
  [],
  {},
  [0],
  [[]],
  [[[]]],
  { x: null },
  { x: undefined },
  { x: { x: { } } },
  { y: [0, "foo", { y: true, a: [] }], b: undefined, a: [5.52, [1.0, [], 2.0], 0.004],  c: -0.0 },
];

const testPojosFlattened = [
  [4],
  [undefined],
  [NaN],
  [],
  [],
  [0],
  [],
  [],
  [null],
  [undefined],
  [],
  [5.52, 1.0, 2.0, 0.004, undefined, -0.0, 0, "foo", true],
];
