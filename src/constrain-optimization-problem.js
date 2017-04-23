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

The return value is a new optimization problem: call it constrainedProblem. This return value has,
in addition to the properties objectiveFunction and initialGuessFunction required by the definition of
optimization problems, two additional properties, both functions:

constrainedProblem.constrainPONJO(ponjo)
 * Takes as input a PONJO, 'ponjo', which must be structurally congruent to
   optimizationProblem.objectiveFunction.domainRepresentative.
 * Produces as output a PONJO which is structurally congruent to
   constrainedProblem.objectiveFunction.domainRepresentative.
 * This function converts between the domains of the two optimization problems, by removing
   fields which are rendered unnecessary by the constraints.

constrainedProblem.unconstrainPONJO(ponjo)
 * Takes as input a PONJO, 'ponjo', which must be structurally congruent to
   constrainedProblem.objectiveFunction.domainRepresentative.
 * Produces as output a PONJO which is structurally congruent to
   optimizationProblem.objectiveFunction.domainRepresentative.
 * This function converts between the domains of the two optimization problems, by adding back in
   fields which are rendered redundant by the constraints.

unconstrainPONJO is a right inverse of constrainPONJO, meaning that for any PONJO 'ponjo' which is
structurally congruent to constrainedProblem.objectiveFunction.domainRepresentative,
constrainedProblem.constrainPONJO(constrainedProblem.unconstrainPONJO(ponjo)) is
deep equal to ponjo.

*/
