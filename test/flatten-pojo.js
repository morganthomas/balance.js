import { expect } from 'chai';
import { flattenPOJO, unflattenPOJO } from '../src/flatten-pojo.js';

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
