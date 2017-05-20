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

*/
