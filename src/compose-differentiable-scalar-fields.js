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

import assert from 'assert';
import { 
  isPONJO, 
  POJOsAreStructurallyCongruent, 
  addPONJOs, 
  scalarMultiplyPONJO, 
  mapScalars
} from './pojo.js';
import { isPath, getAtPath, setAtPath } from './path.js';

function expandDomainOfDifferentiableScalarField(scalarField, newDomainRepresentative, rootPath) {
  assert(isPath(rootPath));
  assert(POJOsAreStructurallyCongruent(
    scalarField.domainRepresentative,
    getAtPath(newDomainRepresentative, rootPath)));
  let zeroedNewDomainRepresentative = scalarMultiplyPONJO(0, newDomainRepresentative);
  
  return {
    domainRepresentative: newDomainRepresentative,
    valueAt(x) {
      assert(POJOsAreStructurallyCongruent(x, newDomainRepresentative));
      return scalarField.valueAt(getAtPath(x, rootPath));
    },
    gradientAt(x) {
      assert(POJOsAreStructurallyCongruent(x, newDomainRepresentative));
      let gradient = scalarField.gradientAt(getAtPath(x, rootPath));
      let result = mapScalars(x => x, zeroedNewDomainRepresentative); // clone
      setAtPath(result, rootPath, gradient);
      return result;
    }
  };
}

function composeDifferentiableScalarFields(options) {
  return {
    domainRepresentative: options.domainRepresentative,
    valueAt(x) {
      assert(POJOsAreStructurallyCongruent(x, options.domainRepresentative));
      return options.valueAt(x, options.subfields.map(subfield => subfield.valueAt(x)));
    },
    gradientAt(x) {
      assert(POJOsAreStructurallyCongruent(x, options.domainRepresentative));
      return options.gradientAt(
        x, 
        options.subfields.map(subfield => subfield.valueAt(x)),
        options.subfields.map(subfield => subfield.gradientAt(x))
      );
    }
  };
}

function sumDifferentiableScalarFields(...subfields) {
  return composeDifferentiableScalarFields({
    domainRepresentative: subfields[0].domainRepresentative,
    subfields: subfields,
    valueAt: (a, vs) => vs.reduce((x,y) => x+y, 0),
    gradientAt: (a, vs, gs) => addPONJOs(...gs)
  });
}

export {
  expandDomainOfDifferentiableScalarField,
  composeDifferentiableScalarFields,
  sumDifferentiableScalarFields,
};