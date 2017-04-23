import assert from 'assert';
import { isPOJO, isScalar, POJOsAreStructurallyCongruent } from './pojo.js';
import { flattenPOJO } from './flatten-pojo.js';

// This function is for removing stuff you don't need from a POJO. 
//
// You can call prunePOJO in two ways: with or without a predicate:
//   prunePOJO(predicate, pojo)
//   prunePOJO(pojo)
//
// The predicate should accept the following arguments:
//   predicate(pojo, path)
// where 'pojo' is a POJO and 'path' is a path (an array of numbers and strings representing a
// sequence of object keys). 'pojo' is whatever value is present at 'path'. The predicate should
// return true iff the value at that path should be kept, in the pruned object.
//
// If you don't supply a predicate, this has the same effect as supplying a predicate that always
// returns true. In this case prunePOJO won't remove any scalar values, and all it will do is
// remove arrays and objects which at bottom contain no scalars.
function prunePOJO(predicate, pojo) {
  if (typeof predicate !== 'function') {
    pojo = predicate;
    predicate = () => true;
  }
  assert(isPOJO(pojo));

  return prunePOJOrecurse(predicate, pojo, []);
}

function prunePOJOrecurse(predicate, pojo, path) {
  if (isScalar(pojo)) {
    return pojo;
  } else if (pojo instanceof Array) {
    let result = [];
    for (let i = 0; i < pojo.length; i++) {
      let subPath = path.concat(i);
      let subPojo = prunePOJOrecurse(predicate, pojo[i], subPath);
      if (isScalar(subPojo)) {
        if (predicate(subPojo, subPath)) {
          result.push(subPojo);
        }
      } else if (subPojo instanceof Array) {
        if (subPojo.length > 0 && predicate(subPojo, subPath)) {
          result.push(subPojo);
        }
      } else {
        // subPojo is a plain object, depending on the assumption that it is a POJO
        if (Object.keys(subPojo).length > 0 && predicate(subPojo, subPath)) {
          result.push(subPojo);
        }
      }
    }
    return result;
  } else {
    // pojo is a plain object, depending on the assumption that it is a POJO
    let result = {};
    for (let key in pojo) {
      let subPath = path.concat(key);
      let subPojo = prunePOJOrecurse(predicate, pojo[key], subPath);

      if (isScalar(subPojo)) {
        if (predicate(subPojo, subPath)) {
          result[key] = subPojo;
        }
      } else if (subPojo instanceof Array) {
        if (subPojo.length > 0 && predicate(subPojo, subPath)) {
          result[key] = subPojo;
        }
      } else {
        // subPojo is a plain object, depending on the assumption that it is a POJO
        if (Object.keys(subPojo).length > 0 && predicate(subPojo, subPath)) {
          result[key] = subPojo;
        }
      }
    }
    return result;
  }
}

// coprunePOJO reverses the process carried out by prunePOJO. It assumes that prunedPojo
// is structurally congruent to prunePOJO(predicate, originalPojo). It returns a new POJO
// (call it coprunedPojo), such that prunePOJO(predicate, coprunedPojo) is deep-equal to prunedPojo,
// coprunedPojo is structurally congruent to originalPojo, and the values for the scalars which
// are taken out by prunePOJO(predicate, coprunedPojo) are drawn from the same locations in
// originalPojo.
//
// You can call coprunePOJO in two ways: with or without a predicate:
//   coprunePOJO(predicate, originalPojo, prunedPojo)
//   coprunePOJO(originalPojo, prunedPojo)
//
// If you don't supply a predicate, this has the same effect as supplying a predicate that always
// returns true.
//
// You can think of prunePOJO and coprunePOJO, when applied to PONJOs, as giving a way of
// going from one PONJO-CC vector space to a subspace thereof (also a PONJO-CC vector space),
// and then going back.
function coprunePOJO(predicate, originalPojo, prunedPojo) {
  if (typeof predicate !== 'function') {
    prunedPojo = originalPojo;
    originalPojo = predicate;
    predicate = () => true;
  }

  assert(isPOJO(originalPojo));
  assert(isPOJO(prunedPojo));
  assert(POJOsAreStructurallyCongruent(prunedPojo, prunePOJO(predicate, originalPojo)));

  let prunedPojoFlat = flattenPOJO(prunedPojo);

  return coprunePOJOrecurse(predicate, originalPojo, prunedPojoFlat, 0, [])[0];
}

function coprunePOJOrecurse(predicate, originalPojo, prunedPojoFlat, index, path) {
  if (isScalar(originalPojo)) {
    if (predicate(originalPojo, path)) {
      return [prunedPojoFlat[index], index+1];
    } else {
      return [originalPojo, index];
    }
  } else if (originalPojo instanceof Array) {
    let result = [];
    for (let i = 0; i < originalPojo.length; i++) {
      let subPath = path.concat(i);
      if (predicate(originalPojo[i], subPath)) {
        let [subPojo, nextIndex] = coprunePOJOrecurse(predicate, originalPojo[i], prunedPojoFlat, index, subPath);
        index = nextIndex;
        result.push(subPojo);
      } else {
        result.push(originalPojo[i]);
      }
    }
    return [result, index];
  } else {
    // originalPojo is a plain object depending on assumption it is a POJO
    let result = {};
    let keys = Object.keys(originalPojo).sort();
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let subPath = path.concat(key);
      if (predicate(originalPojo[key], subPath)) {
        let [subPojo, nextIndex] = coprunePOJOrecurse(predicate, originalPojo[key], prunedPojoFlat, index, subPath);
        index = nextIndex;
        result[key] = subPojo;
      } else {
        result[key] = originalPojo[key];
      }
    }
    return [result, index];
  }
}

export { prunePOJO, coprunePOJO }
