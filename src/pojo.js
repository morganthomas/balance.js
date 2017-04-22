/*

== Definitions ==

=== Scalars ===

A "scalar" is any instance of the following types: number, string, boolean, null, undefined.

=== POJO ===

A POJO is a Plain Old JavaScript Object. Formally, we will define POJOs as follows:

1. Any scalar is a POJO.
2. An array [p1,...,pn] is a POJO iff its elements are all POJOs.
3. An object { k1: v1, ..., kn: vn } is a POJO iff its keys are all strings and its values
   are all POJOs.

POJOs are required by definition to be free of reference cycles.

An object y is "part of" a POJO x iff one of these conditions holds:

1. y === x
2. x is an array [p1,...,pn] and y is a part of some element of x.
3. x is an object { k1: v1, ..., kn: nv } and y is a part of some value of x.

=== PONJO and PONuNJO ===

A PONJO is a Plain Old Numeric JavaScript Object. A PONJO is a POJO where all scalar values
that are part of the object are real numbers (i.e., their type is 'number' and they are not -Infinity, Infinity, or NaN).

A PONuNJO is a Plain Old Nullable Numeric JavaScript Object. A PONuNJO is a POJO where all
scalar values that are part of the objects are either numbers or null.

=== POJO congruency ===

Congruent POJOs are POJOs which share exactly the same recursive structure. POJO congruency is
defined recursively as follows:

1. If x and y are scalar values (i.e., non-array, non-objects), then x is congruent to y.
2. Let n be a non-negative integer. Suppose that t1,...,tn and u1,...,un are sequences of POJOs,
   and for each 0 <= i <= n, ti is congruent to ui. Then [t1,...,tn] is congruent to [u1,...,un].
3. Let n be a non-negative integer. Suppose that k1,...,kn is a sequence of strings, and t1,...,tn
   and u1,...,un are sequences of POJOs. Suppose for each 0 <= i <= n, ti is congruent to ui. Then
   { k1: v1, ..., kn: vn } is congruent to { k1: u1, ..., kn: un }.

Since PONJOS and PONuNJOs are POJOs, we can use the same definition to speak of the congruency of
PONJOs and PONuNJOs.

=== Congruency class ===

Given any POJO p, we define the "POJO congruency class (or POJO-CC) of p" to be the (infinite) set of 
all POJOs which are congruent to p.

Similarly, given any PONJO p, we define the "PONJO congruency class (or PONJO-CC) of p" to be the
(infinite) set of all PONJOs which are congruent to p.

Given any PONuNJO p, we define the "PONuNJO congruency class (or PONuNJO-CC) of p" in the same way.

A set S is "a POJO congruency class (POJO-CC)" if for some POJO p, S is the POJO-CC of p. We can
similarly define the phrases "a PONJO congruency class (PONJO-CC)" and "a PONuNJO congruency class
(PONuNJO-CC)."

An interesting fact about PONJO-CCs is that each of them forms a (finite-dimensional, Euclidean)
vector space, when idealizing away issues such as rounding error and the existence of non-numeric
number values like Infinity in JavaScript. In PONJO-CC vector spaces, vector addition is performed
pointwise on the scalar parts of the object, and scalar multiplication is performed across all scalar 
parts of the object.

The same statement does not make sense about POJO-CCs or PONuNJO-CCs. Neither type of set forms an
(approximation of a) vector space in any general way that's apparent to me.

POJO-CCs, being infinite sets, can't be directly represented in JavaScript. The best way to represent
a POJO-CC in JavaScript is by a representative of the congruency class: i.e., one POJO which belongs
to that congruency class. Given such a representative, one can test any POJO for membership in the
congruency class, by testing it for congruency with the representative. Similar comments apply to
PONJO-CCs and PONuNJO-CCs.

=== POJO-like predicate ===

"is a POJO," "is a PONJO," and "is a PONuNJO" are all examples of POJO-like predicates. POJO-like
predicates are all variations on "is a POJO" which can be produced by substituting different scalar
predicates. For "is a POJO," the scalar predicate is "is a scalar (i.e. a number, string, boolean,
null, or undefined)." For "is a PONJO," the scalar predicate is "is a number." And so forth.

== Working with POJOs ==

The following functions help us to work with POJOs:

mapScalars(f, p)
  Takes a function f and a POJO p. Applies f to all scalar values in p, returning a new POJO
  which is like p except each scalar value has been replaced with its corresponding return value
  from f. f must return a POJO for each scalar input.

zipObjects(f, p1, ..., pn)
  Takes a function f and POJOs p1,...,pn. All of p1,...,pn must be congruent to each other.
  At each location in the recursive structure of p1 where there is a scalar, f receives as
  arguments the values of p1,...,pn at that location, and is expected to return a POJO.
  zipObjects returns the result of replacing each scalar part of p1 with the return value
  of f from doing the aforementioned operation at the given location.

== Working with PONJOs and PONuNJOs ==

The following functions help us to work with PONuNJOs:

scalarMultiplyPONuNJOs(a, ponunjo)
addPONuNJOs(ponunjo1, ponunjo2)

These functions both operate pointwise, and they let null behave infectiously (any calculation
involving null comes out null).

The following functions help us to work with PONJOs:

scalarMultiplyPONJOs(a, ponjo)
addPONJOs(ponjo1, ponjo2)

These do the same as the corresponding functions on PONuNJOs, but they lack null handling logic.
The motivation for these functions on PONJOs is the theory that omitting null checks when working
on PONJOs can allow for better JIT compiler optimization.

*/

const _scalarTypes = ['undefined', 'boolean', 'number', 'string'];
const _objectPrototype = Object.getPrototypeOf({});

function isScalar(x) {
  return x === null || _scalarTypes.indexOf(typeof x) > -1;
}

function isRealNumber(x) {
  return typeof x === 'number' && x !== -Infinity && x !== Infinity && !isNaN(x);
}

function isNullableRealNumber(x) {
  return x === null || isRealNumber(x);
}

/// DANGER: isPOJOlike does not check for cycles in the objects it receives!
/// It will enter an infinite loop if you pass it a cyclic object!
function isPOJOlike(scalarPredicate) {
  return function isPOJOlikeInstance(x) {
    if (scalarPredicate(x)) {
      return true;
    } else if (x instanceof Array) {
      return x.every(isPOJOlikeInstance);
    } else if (x !== null && x !== undefined &&
               Object.getPrototypeOf(x) === _objectPrototype) {
      for (let key in x) {
        if (!isPOJOlikeInstance(x[key])) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
}

const isPOJO = isPOJOlike(isScalar);
const isPONJO = isPOJOlike(isRealNumber);
const isPONuNJO = isPOJOlike(isNullableRealNumber);

/// ASSUMES pojo1 and pojo2 are both POJOs.
function POJOsAreStructurallyCongruent(pojo1, pojo2) {
  let pojo1IsScalar = isScalar(pojo1);
  let pojo2IsScalar = isScalar(pojo2);
  let pojo1IsArray = pojo1 instanceof Array;
  let pojo2IsArray = pojo2 instanceof Array;

  if (pojo1IsScalar && pojo2IsScalar) {
    return true;
  } else if (pojo1IsArray && pojo2IsArray && pojo1.length === pojo2.length) {
    for (let i = 0; i < pojo1.length; i++) {
      if (!POJOsAreStructurallyCongruent(pojo1[i], pojo2[i])) {
        return false;
      }
    }
    return true;
  } else if (!pojo1IsScalar && !pojo2IsScalar && !pojo1IsArray && !pojo2IsArray) {
    // in this case pojo1 and pojo2 are plain objects, depending on the assumption that they are POJOs.
    // first check that every key in pojo1 is in pojo2 and that the corresponding values are congruent.
    for (let key in pojo1) {
      if (!pojo2.hasOwnProperty(key) || !POJOsAreStructurallyCongruent(pojo1[key], pojo2[key])) {
        return false;
      }
    }
    // next check that every key in pojo2 is in pojo1.
    for (let key in pojo2) {
      if (!pojo1.hasOwnProperty(key)) {
        return false;
      }
    }
    // and if we make it here we know the objects are structurally congruent.
    return true;
  } else {
    return false;
  }
}

// ASSUMES
//   pojo is a POJO
//   f is a function that takes a scalar as input and produces a POJO as output
function mapScalars(f, pojo) {
  if (isScalar(pojo)) {
    return f(pojo);
  } else if (pojo instanceof Array) {
    return pojo.map(subpojo => mapScalars(f, subpojo));
  } else {
    // pojo is a plain object, depending on the assumption that it is a POJO
    var result = {};
    for (let key in pojo) {
      result[key] = mapScalars(f, pojo[key]);
    }
    return result;
  }
}

// ASSUMES
//   a is a real number
//   ponunjo is a PONuNJO
function scalarMultiplyPONuNJO(a, ponunjo) {
  return mapScalars(x => x === null ? null : a * x, ponunjo);
}

// ASSUMES
//   a is a real number
//   ponjo is a PONJO
function scalarMultiplyPONJO(a, ponjo) {
  return mapScalars(x => a * x, ponjo);
}

export {
  isScalar,
  isRealNumber,
  isNullableRealNumber,
  isPOJOlike,
  isPOJO,
  isPONJO,
  isPONuNJO,
  POJOsAreStructurallyCongruent,
  mapScalars,
  scalarMultiplyPONuNJO,
  scalarMultiplyPONJO,
};
