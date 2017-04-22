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
 * Assumes that as input it gets one PONuNJO congruent to objective.inputClassRepr.
 * As output it produces a PONJO congruent to objective.inputClassRepr, where every
   number equals the number in the same location in the input if the same location in the
   input does not have value null.

*/

import { uncmin } from 'numeric';
import { flattenPOJO, unflattenPOJO } from './flatten-pojo.js';

function solveOptimizationProblem(optimizationProblem, constraints) {
  let initialGuess = optimizationProblem.initialGuessFunction(constraints);
  let initialGuessFlat = flattenPOJO(initialGuess);
  let { valueAt, gradientAt, inputClassRepr } = optimizationProblem.objectiveFunction;
  
  let valueAtFlat = (x) =>
      valueAt(unflattenPOJO(inputClassRepr, x));

  let gradientAtFlat = (x) =>
      flattenPOJO(gradientAt(unflattenPOJO(inputClassRepr, x)));

  let solutionFlat = uncmin(
    valueAtFlat,
    initialGuessFlat,
    gradientAtFlat
  );

  return unflattenPOJO(inputClassRepr, solutionFlat);
}

export { solveOptimizationProblem };
