/*

A velement, or visual element, is a component of a visual document layout.
A velement is an object of the following form:

  {
    layoutProblem: ...,
    render: ...,
    animationDuration: ...
  }

 * layoutProblem is an optimization problem (see optimization-problem.js).
 * render is a function. It takes a solution to the layout problem as input, and produces
   a graphics object as output (see graphics.js).
 * animationDuration is a number. It is the amount of time for which the velement is animated.
   Can be Infinity for velements that animate indefinitely. Can be zero for non-animated velements.

*/
