/*

A velement, or visual element, is a component of a visual document layout.
A velement is an object of the following form:

  {
    layoutProblem: ...,
    render: ...
  }

 * layoutProblem is an optimization problem (see optimization-problem.js).
 * render is a function. It takes a solution to the layout problem as input, and produces
   a graphics object as output (see graphics.js).

One important type of velements, the only type that has been coded so far, are
"box velements." A box velement, by definition, is a velement whose layout problem's
domain (i.e. layoutProblem.objectiveFunction.domainRepresentative) has scalar
properties 'width' and 'height'.

When you have a box velement, you are entitled to assume that it intends to draw itself
in a rectangle of width sln.width and sln.height, where sln is the solution you pass to its
render function. The top left corner of this rectangle is at (0,0). Box velements can also draw
outside their bounding rectangle if that's the desired behavior.

== renderBoxVElement(velement, width, height) ==

This function returns the graphics object resulting from rendering the given velement
at the given width and height.

*/

import { mapScalars } from './pojo.js';
import { constrainOptimizationProblem } from './constrain-optimization-problem.js';
import { solveOptimizationProblem } from './optimization-problem.js';

function renderBoxVElement(velement, width, height) {
  let problem = velement.layoutProblem;
  let constrainedProblem = constrainOptimizationProblem(problem, [[['width'], width], [['height'], height]]);
  let constrainedSolution = solveOptimizationProblem(constrainedProblem);
  let solution = constrainedProblem.unconstrainPONuNJO(constrainedSolution);
  let graphics = velement.render(solution);
  return graphics;
}

export { renderBoxVElement }
