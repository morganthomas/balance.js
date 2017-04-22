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
     ASSUMES that as input it gets one PONuNJO congruent to objective.inputClassRepr.
     As output it produces a PONJO congruent to objective.inputClassRepr, where every
     number equals the number in the same location in the input if the same location in the
     nput does not have value null.

*/

import assert from 'assert';
import { uncmin } from 'numeric';
import { POJOsAreStructurallyCongruent, isPONJO } from './pojo.js';
import { flattenPOJO, unflattenPOJO } from './flatten-pojo.js';

function solveOptimizationProblem(optimizationProblem, constraints) {
  let { valueAt, gradientAt, inputClassRepr } = optimizationProblem.objectiveFunction;
  assert(isPONJO(inputClassRepr));
  assert(POJOsAreStructurallyCongruent(constraints, inputClassRepr));
  let initialGuess = optimizationProblem.initialGuessFunction(constraints);
  assert(POJOsAreStructurallyCongruent(constraints, inputClassRepr));
  let initialGuessFlat = flattenPOJO(initialGuess);
  
  let valueAtFlat = function(x) {
    return valueAt(unflattenPOJO(inputClassRepr, x));
  };

  let gradientAtFlat = function(x) {
    let result = gradientAt(unflattenPOJO(inputClassRepr, x));
    assert(POJOsAreStructurallyCongruent(result, inputClassRepr));
    return flattenPOJO(result);
  };

  let solutionFlat = uncmin(
    valueAtFlat,
    initialGuessFlat,
    gradientAtFlat
  ).solution;

  return unflattenPOJO(inputClassRepr, solutionFlat);
}

export { solveOptimizationProblem };
