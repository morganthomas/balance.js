/*

This file is for making new optimization problems, either via simple math formulas, defining 
optimization problems either by scratch or by putting together existing optimization problems.
It defines the following functions:

== composeOptimizationProblem(options) ==

'options' is an object with the following structure:

  {
    domain: ...,
    formula: ...,
    [subproblems: { ... },]
  }

 * 'domain' is a PONJO which is a representative of the domain of the optimization problem,
   not including paths added by any subproblems.
 * 'formula' is an object representing a math formula. Formulas are constructed by the
   following functions:
    * F.constant(number)
    * F.path(path)
    * F.subproblem(path)
    * F.sum(...formulas)
    * F.difference(...formulas)
    * F.product(formula1, formula2)
    * F.quotient(numeratorFormula, denominatorFormula)
    * F.monomial(path1, exponent1, path2, exponent2, ...)
    * F.power(baseFormula, exponentFormula)
    * F.logarithm(baseFormula, formula)
    * F.sqrt(formula)
 * 'subproblems' is an optional property containing an object whose values are
   optimization problems or arrays of optimization problems. For each key in
   'subproblems,' a corresponding key is added to 'domain' (it is an error if it is already
   there). If the value of the key is an optimization problem, then the corresponding value
   in 'domain' is the domain representative of the optimization problem. If the value of
   the key is an array of optimization problems, then the corresponding value in
   'domain' is the array of the domain representatives of the optimization problems.

== computePartialDerivative(formula, path) ==

Computes the partial derivative of the given formula by the given path.

*/

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
function partialDerivative(formula) {
  return partialDerivativeCases[formula[0]](...formula.slice(1));
}

const partialDerivativeCases = {
  constant: (n) => F.constant(0),
}

export {
  F,
  partialDerivative,
};
