/*

This file is for composing multiple differentiable scalar fields to produce a new
differentiable scalar field (see differentiable-scalar-field.js).

== composeDifferentiableScalarFields(options) ==

options is an object of the following form:
  {
    domainRepresentative: ...,
    subfields: [ ... ],
    valueAt(x, subfieldValues),
    gradientAt(x, subfieldValues, subfieldGradients),
  }

 * domainRepresentative is a PONJO which will represent the domain of the produced scalar field.
 * subfields is an array of differentiable scalar fields with subfields[i].domainRepresentative
   congruent to domainRepresentative for all i.
 * valueAt and gradientAt are functions.

The resulting composed differentiable scalar field can be described by the formula:

  f.valueAt(x) = options.valueAt(x,
    [subfields[0].valueAt(x), ..., subfields[subfields.length-1].valueAt(x)])

And its gradient can be described by the formula:

  f.gradientAt(x) = options.gradientAt(x,
    [subfields[0].valueAt(x), ..., subfields[subfields.length-1].valueAt(x)],
    [subfields[0].gradientAt(x), ..., subfields[subfields.length-1].gradientAt(x)])

*/
