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
that are part of the object are numbers.

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

*/

const _scalarTypes = ['undefined', 'boolean', 'number', 'string'];
const _objectPrototype = Object.getPrototypeOf({});

function isScalar(x) {
  return x === null || _scalarTypes.indexOf(typeof x) > -1;
}

function isPOJO(x) {
  if (isScalar(x)) {
    return true;
  } else if (x instanceof Array) {
    return x.every(isPOJO);
  } else if (Object.getPrototypeOf(x) === _objectPrototype) {
    for (let key in x) {
      if (!isPOJO(x[key])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

export {
  isScalar,
  isPOJO,
};
