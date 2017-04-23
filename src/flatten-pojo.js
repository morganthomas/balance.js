/*

This file is for turning a POJO into a sequential array of the scalars it contains, and then
reversing the transformation. This is done with two functions:

flattenPOJO(pojo)
  ASSUMES pojo is a POJO
  Outputs an array containing all the scalars in pojo arranged in a deterministic linear sequence.

unflattenPOJO(referencePojo, array)
  ASSUMES
    pojo is a POJO
    array is (deep-equal to) the result of calling flattenPOJO on some POJO congruent to pojo
  Outputs a POJO newPojo which is congruent to pojo, such that flattenPOJO(newPojo) outputs
  an array deep-equal to 'array'.

You can think of these functions as constructively proving that every PONJO-CC is isomorphic as a
vector space to R^n, the n-dimensional Euclidean space, where n is the number of scalar values in
a representative of the given PONJO-CC.

*/

import {
  isScalar
} from './pojo.js';

function flattenPOJO(pojo) {
  let results = [];
  flattenPOJOtraverse(pojo, results);
  return results;
}


function flattenPOJOtraverse(pojo, results) {
  if (isScalar(pojo)) {
    results.push(pojo);
  } else if (pojo instanceof Array) {
    pojo.forEach((subpojo) => flattenPOJOtraverse(subpojo, results));
  } else {
    // pojo is a plain object, depending on the assumption that it is a POJO
    let keys = Object.keys(pojo).sort();
    keys.forEach((key) => flattenPOJOtraverse(pojo[key], results));
  }
}

function unflattenPOJO(referencePojo, array) {
  return unflattenPOJOrecurse(referencePojo, array, 0)[0];
}

function unflattenPOJOrecurse(referencePojo, array, index) {
  if (isScalar(referencePojo)) {
    return [array[index], index+1];
  } else if (referencePojo instanceof Array) {
    var result = [];
    for (let i = 0; i < referencePojo.length; i++) {
      let [subResult, nextIndex] = unflattenPOJOrecurse(referencePojo[i], array, index);
      index = nextIndex;
      result.push(subResult);
    }
    return [result, index];
  } else {
    // referencePojo is a plain object, depending on the assumption that it is a POJO
    var result = {};
    let keys = Object.keys(referencePojo).sort();
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let [keyValue, nextIndex] = unflattenPOJOrecurse(referencePojo[key], array, index);
      index = nextIndex;
      result[key] = keyValue;
    }
    return [result, index];
  }
}

export { flattenPOJO, unflattenPOJO };
