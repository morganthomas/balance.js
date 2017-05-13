/*

This file is for composing multiple differentiable scalar fields to produce a new
differentiable scalar field (see scalar-field.js).

== composeDifferentiableScalarFields(options) ==

options is an object of the following form:
  {
    domainRepresentative: ...,
    subfields: [ ... ],
    subdomainMaps: [ ... ],
    integrator: ...,
  }

 * domainRepresentative is a PONJO which will represent the domain of the produced scalar field.
 * subfields is an array of differentiable scalar fields. 
 * subdomainMaps is an array of functions of the same length as the subfields
   array. subdomainMaps[i] should map any PONJO congruent to domainRepresentative to a PONJO congruent
   to subfields[i].domainRepresentative.
 * integrator is a differentiable scalar field whose input domain should be represented by
   [domainRepresentative, [1,...,subfields.length]] (in other words a pair consisting of
   a first element congruent to domainRepresentative and a second element which is an array of
   scalars of the same length as the subfields array).

*/
