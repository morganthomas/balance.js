/*

This file is for applying equality constraints to optimization problems, in order to produce new
optimization problems. It defines the following functions:

== constrainOptimizationProblem(problem, constraints) ==

'problem' is an optimization problem. 'constraints' is a list of equivalence classes. 
An equivalence class, by definition, is an array equiv such that:
 * at most one element of equiv, not the first element, is either a number or a function; and,
 * all other elements of equiv are paths (i.e. arrays of positive integers and/or strings);
   said paths must exist in problem.objectiveFunction.domainRepresentative.
 * we say that the first element of the equivalence class is the 'representative' of the class.

All paths in an equivalence class besides the representative will be eliminated in the constrained
problem. If a number or function is included in the equivalence class, then all paths in the
equivalence class are eliminated in the constrained problem, and their common value is either
the given constant number or the result of applying the given function to the constrained vector.

No path may occur in two equivalence classes in the constraints array.

The return value is a new optimization problem: call it constrainedProblem. This return value has,
in addition to the properties objectiveFunction and initialGuessFunction required by the definition of
optimization problems, two additional properties, both functions:

constrainedProblem.constrainPONuNJO(ponunjo)
 * Takes as input a PONuNJO, 'ponunjo', which must be structurally congruent to
   problem.objectiveFunction.domainRepresentative.
 * Produces as output a PONuNJO which is structurally congruent to
   constrainedProblem.objectiveFunction.domainRepresentative.
 * This function converts between the domains of the two optimization problems, by removing
   fields which are rendered unnecessary by the constraints.

constrainedProblem.unconstrainPONuNJO(ponunjo)
 * Takes as input a PONuNJO, 'ponunjo', which must be structurally congruent to
   constrainedProblem.objectiveFunction.domainRepresentative.
 * Produces as output a PONuNJO which is structurally congruent to
   problem.objectiveFunction.domainRepresentative.
 * This function converts between the domains of the two optimization problems, by adding back in
   fields which are rendered redundant by the constraints.

unconstrainPONuNJO is a right inverse of constrainPONuNJO on PONJOs, meaning that for any
PONJO 'ponjo' which is structurally congruent to constrainedProblem.objectiveFunction.domainRepresentative,
constrainedProblem.constrainPONuNJO(constrainedProblem.unconstrainPONuNJO(ponjo)) is
deep equal to ponjo.

*/

import assert from 'assert';

function constrainOptimizationProblem(problem, constraints) {

}

// ASSUMES constraints is a valid array of constraints
function getPathsToPrune(constraints) {
  let equivalenceClasses = constraints;
  return [].concat(...equivalenceClasses.map(getPathsToPruneFromEquivalenceClass));
}

// ASSUMES equivalenceClass is an equivalence class.
function getPathsToPruneFromEquivalenceClass(equivalenceClass) {
  let isNonPathMember =
    member => ['number', 'function'].indexOf(typeof member) >= 0;

  let nonPaths = equivalenceClass.filter(isNonPathMember);
  let paths = equivalenceClass.filter(x => !isNonPathMember(x));

  assert(nonPaths.length === 0 || nonPaths.length === 1);

  if (nonPaths.length > 0) {
    return paths;
  } else {
    return paths.slice(1);
  }
}

export {
  constrainOptimizationProblem,
  getPathsToPrune, // exported for testing purposes; don't recommend using
}
