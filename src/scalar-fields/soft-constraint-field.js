/*

This file provides a way of making scalar fields which express soft constraints
on some of the parameters.

== makeSoftConstraintField(domainRepresentative, linearCombination, intensity, base) ==

Creates a differentiable scalar field with the given domainRepresentative.
This field will make the optimizer want to minimize the magnitude of the
given linearCombination. A linear combination is an array of the form
[[a1,p1,c1],...,[an,pn1,c1]], where each of a1,...,an, c1,...,cn is a
number, and each of p1,...,pn is a path in the given domain. The
c1,...,cn are optional. The following formula represents the returned scalar field:

  intensity * ((a1*(p1-c1) + ... + an*(pn-cn)) + base)^2

'intensity' is a coefficient applied to the whole formula.

*/

import assert from 'assert';
import { POJOsAreStructurallyCongruent, mapScalars } from '../pojo.js';
import { getAtPath, setAtPath } from '../path.js';

const DEFAULT_INTENSITY = 1000;

function makeSoftConstraintField(domainRepresentative, linearCombination, intensity, base) {
  intensity = intensity || DEFAULT_INTENSITY;
  base = base || 0;
  return {
    domainRepresentative,
    valueAt(x) {
      assert(POJOsAreStructurallyCongruent(domainRepresentative, x));
      let deviation = evaluateLinearCombination(linearCombination, x) + base;
      return intensity * deviation * deviation;
    },
    gradientAt(x) {
      assert(POJOsAreStructurallyCongruent(domainRepresentative, x));
      let gradient = mapScalars(() => 0, domainRepresentative);
      let deviation = evaluateLinearCombination(linearCombination, x);
      for (let i = 0; i < linearCombination.length; i++) {
        let path = linearCombination[i][1];
        let coef = linearCombination[i][0];
        setAtPath(gradient, path, 2 * intensity * coef * deviation);
      }
      return gradient;
    }
  };
}

function evaluateLinearCombination(combination, x) {
  return combination.map(term => term[0] * (getAtPath(x, term[1]) - (term[2] || 0))).reduce((x,y)=>x+y, 0);
}

export { makeSoftConstraintField }
