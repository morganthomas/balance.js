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
    * monomial(path1, exponent1, path2, exponent2, ...)
    * power(baseFormula, exponentFormula)
    * logarithm(baseFormula, formula)
    * sqrt(formula)
 * 'subproblems' is an optional property containing an object whose values are
   optimization problems or arrays of optimization problems. For each key in
   'subproblems,' a corresponding key is added to 'domain' (it is an error if it is already
   there). If the value of the key is an optimization problem, then the corresponding value
   in 'domain' is the domain representative of the optimization problem. If the value of
   the key is an array of optimization problems, then the corresponding value in
   'domain' is the array of the domain representatives of the optimization problems.

*/
