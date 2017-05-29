/*

This file provides a way of making scalar fields which express soft constraints
on some of the parameters.

== makeSoftConstraintField(domainRepresentative, linearCombination) ==

Creates a differentiable scalar field with the given domainRepresentative.
This field will make the optimizer want to minimize the magnitude of the
given linearCombination. A linear combination is an array of the form
[[a1,p1],...,[an,pn]], where each of a1,...,an is a number, and each of
p1,...,pn is a path in the given domain.

*/

import { POJOsAreStructurallyCongruent, mapScalars } from '../pojo.js';
import { getAtPath, setAtPath } from '../path.js';

const DEFAULT_INTENSITY = 1000;

function makeSoftConstraintField(domainRepresentative, linearCombination, intensity) {
  intensity = intensity || DEFAULT_INTENSITY;
  return {
    domainRepresentative,
    valueAt(x) {
      assert(POJOsAreStructurallyCongruent(domainRepresentative, x));
      let deviation = evaluateLinearCombination(linearCombination, x);
      return intensity * deviation * deviation;
    },
    gradientAt(x) {
      assert(POJOsAreStructurallyCongruent(domainRepresentative, x));
      let deviation = evaluateLinearCombination(linearCombination, x);
      let gradient = mapScalars(() => 0, domainRepresentative);
      for (let i = 0; i < linearCombination.length; i++) {
        let path = linearCombinations[i][1];
        let codeviation = (evaluateLinearCombination([linearCombination[i]], x) - deviation);
        setAtPath(gradient, path, 2 * intensity * codeviation);
      }
      return gradient;
    }
  };
}

function evaluateLinearCombination(combination, x) {
  return combination.map(term => term[0] * getAtPath(x, term[1])).reduce((x,y)=>x+y, 0);
}

export { makeSoftConstraintField }
