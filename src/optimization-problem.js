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
       This is its "constraints."
     * As output it produces a PONJO congruent to objective.domainRepresentative, where every
       number equals the number in the same location in the input if the same location in the
       input does not have value null.

*/

import assert from 'assert';
import { uncmin } from 'numeric';
import { POJOsAreStructurallyCongruent, isPONJO, isPONuNJO, zipPOJOs, mapScalars } from './pojo.js';
import { flattenPOJO, unflattenPOJO } from './flatten-pojo.js';

function solveOptimizationProblem(optimizationProblem) {
  let { valueAt, gradientAt, domainRepresentative } = optimizationProblem.objectiveFunction;
  assert(isPONJO(domainRepresentative));
  let constraints = mapScalars(() => null, domainRepresentative);
  let initialGuess = optimizationProblem.initialGuessFunction(constraints);
  assert(isPONJO(initialGuess));
  assert(POJOsAreStructurallyCongruent(initialGuess, domainRepresentative));
  assert(flattenPOJO(zipPOJOs(
    (guess, constraint) => constraint === null || guess === constraint,
    initialGuess,
    constraints)).every(t => t));
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
