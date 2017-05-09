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
    * constant(number)
    * path(path)
    * sum(...formulas)
    * difference(...formulas)
    * product(...formulas)
    * quotient(numeratorFormula, denominatorFormula)
    * monomial(formula, exponent)
    * power(baseFormula, exponentFormula)
    * logarithm(baseFormula, formula)
 * 'subproblems' is an optional property containing an object whose values are
   optimization problems or arrays of optimization problems.

*/
