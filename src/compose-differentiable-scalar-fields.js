/*

This file is for composing multiple differentiable scalar fields to produce a new
differentiable scalar field (see differentiable-scalar-field.js).

We begin with a useful helper function:

== expandDomainOfDifferentiableScalarField(scalarField, newDomainRepresentative, rootPath) ==

This takes a differentiable scalar field and returns a new differentiable scalar field where the
domain is represented by newDomainRepresentative.

 * rootPath must be a path.
 * getAtPath(newDomainRepresentative, rootPath) must be congruent to scalarField.domainRepresentative.

The resulting differentiable scalar field can be described by the formula:

  f.valueAt(x) = scalarField.valueAt(getAtPath(x, rootPath))
  f.gradientAt(x) = scalarField.gradientAt(getAtPath(x, rootPath))

The next function is the core function of this module:

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

A useful common case:

== sumDifferentiableScalarFields(subfields) ==

Takes an array of differentiable scalar fields with congruent domain representatives.
Returns a new differentiable scalar field which behaves as the sum of the given scalar fields.

*/
