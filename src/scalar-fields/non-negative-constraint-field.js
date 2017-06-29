/*

This file lets you make scalar fields which impose a soft constraint that a specified
parameter must be non-negative.

== makeNonNegativeConstraintField(domainRepresentative, parameter, intensity) ==

*/

import assert from 'assert';
import { POJOsAreStructurallyCongruent, mapScalars } from '../pojo.js';
import { getAtPath, setAtPath } from '../path.js';

// TODO: test
function makeNonNegativeConstraintField(domainRepresentative, parameter, intensity) {
  return {
    domainRepresentative,
    valueAt(x) {
      assert(POJOsAreStructurallyCongruent(domainRepresentative, x));
      let value = getAtPath(x, parameter);
      if (value < 0) {
        return intensity * value * value;
      } else {
        return 0;
      }
    },
    gradientAt(x) {
      assert(POJOsAreStructurallyCongruent(domainRepresentative, x));
      let gradient = mapScalars(() => 0, domainRepresentative);
      let input = getAtPath(x, parameter);
      let output;
      if (input < 0) {
        output = 2 * intensity * input;
      } else {
        output = 0;
      }
      setAtPath(gradient, parameter, output);
      return gradient;
    }
  };
}

export { makeNonNegativeConstraintField }
