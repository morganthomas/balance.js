/*

== Definitions ==

A "differentiable scalar field" is an object of the form

  {
    inputClassRepr: inputClassRepr,
    valueAt: valueAt,
    gradient: gradientAt,
  }

where:

 * inputClassRepr is a PONJO. It's a representative of the congruency class of PONJOs which
   constitute the input domains of valueAt and gradientAt.
 * valueAt is a function.
    * Assumes that as input it gets one PONJO congruent to inputClassRepr.
    * As output it produces a real number.
 * gradientAt is a function.
    * Assumes that as input it gets one PONJO congruent to inputClassRepr.
    * As output it produces a PONJO congruent to inputClassRepr.

*/
