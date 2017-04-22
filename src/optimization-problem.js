/*

== Definitions ==

An "optimization problem" is an object of the form

  {
    objectiveFunction: objectiveFunction,
    initialGuessFunction: initialGuessFunction,
  }

where:

 * objectiveFunction is a differentiable scalar field.
 * initialGuessFunction is a function.
     * Assumes that as input it gets one PONuNJO congruent to objective.domainRepresentative.
     * As output it produces a PONJO congruent to objective.domainRepresentative, where every
       number equals the number in the same location in the input if the same location in the
       nput does not have value null.

*/

import assert from 'assert';
import { uncmin } from 'numeric';
import { POJOsAreStructurallyCongruent, isPONJO, isPONuNJO } from './pojo.js';
import { flattenPOJO, unflattenPOJO } from './flatten-pojo.js';

function solveOptimizationProblem(optimizationProblem, constraints) {
  let { valueAt, gradientAt, domainRepresentative } = optimizationProblem.objectiveFunction;
  assert(isPONJO(domainRepresentative));
  assert(isPONuNJO(constraints));
  assert(POJOsAreStructurallyCongruent(constraints, domainRepresentative));
  let initialGuess = optimizationProblem.initialGuessFunction(constraints);
  assert(isPONJO(initialGuess));
  assert(POJOsAreStructurallyCongruent(initialGuess, domainRepresentative));
  let initialGuessFlat = flattenPOJO(initialGuess);
  
  let valueAtFlat = function(x) {
    return valueAt(unflattenPOJO(domainRepresentative, x));
  };

  let gradientAtFlat = function(x) {
    let result = gradientAt(unflattenPOJO(domainRepresentative, x));
    assert(POJOsAreStructurallyCongruent(result, domainRepresentative));
    return flattenPOJO(result);
  };

  let solutionFlat = uncmin(
    valueAtFlat,
    initialGuessFlat,
    gradientAtFlat
  ).solution;

  return unflattenPOJO(domainRepresentative, solutionFlat);
}

export { solveOptimizationProblem };
