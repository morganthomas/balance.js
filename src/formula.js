/*

Objects representing math formulas. Formulas are constructed by the
following functions:
 * F.constant(number)
 * F.path(path)
 * F.sum(...formulas)
 * F.difference(...formulas)
 * F.product(formula1, formula2)
 * F.quotient(numeratorFormula, denominatorFormula)
 * F.monomial(path1, exponent1, path2, exponent2, ...)
 * F.power(baseFormula, exponentFormula)
 * F.logarithm(baseFormula, formula)
 * F.sqrt(formula)

== partialDerivative(formula, path) ==

Computes the partial derivative of the given formula by the given path, returning another formula.

*/

import { deepEquals } from './pojo.js';

// TODO: add assertions to check inputs.
const F = {
  constant: (n) => ['constant', n],
  path: (p) => ['path', p],
  subproblem: (path) => ['subproblem', path],
  sum: (...formulas) => ['sum', formulas],
  difference: (...formulas) => ['difference', formulas],
  product: (formula1, formula2) => ['product', formula1, formula2],
  quotient: (numeratorFormula, denominatorFormula) => ['quotient', numeratorFormula, denominatorFormula],
  monomial: (...args) => ['monomial', args],
  power: (baseFormula, exponentFormula) => ['power', baseFormula, exponentFormula],
  logarithm: (baseFormula, formula) => ['logarithm', baseFormula, formula],
  sqrt: (formula) => ['sqrt', formula],
};

// TODO: error handling
function partialDerivative(by, formula) {
  return partialDerivativeCases[formula[0]](by, ...formula.slice(1));
}

const partialDerivativeCases = {
  constant: (v, n) => F.constant(0),
  path: (v, u) => deepEquals(v,u) ? F.constant(1) : F.constant(0),
}

export {
  F,
  partialDerivative,
};
