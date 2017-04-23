/*

This file is for applying equality constraints to optimization problems, in order to produce new
optimization problems. It defines the following functions:

== constrainOptimizationProblem(optimizationProblem, constraints) ==

'optimizationProblem' is an optimization problem. 'constraints' is a list of equivalence classes. 
An equivalence class, by definition, is an array equiv such that:
 * at most one element of equiv is either a number or a function; and,
 * all other elements of equiv are paths (i.e. arrays of positive integers and/or strings);
   said paths must exist in optimizationProblem.objectiveFunction.domainRepresentative.

No path may occur in two equivalence classes in the constraints array.

*/
