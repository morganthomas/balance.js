import assert from 'assert';
import { isPOJO, isScalar } from './pojo.js';

// This function is for removing stuff you don't need from a POJO. It takes a predicate, and
// tests the predicate against every scalar value in the POJO. It throws out the locations in the
// POJO with a scalar value for which the predicate returns falsy. It also throws out empty arrays
// and empty objects. Generally, it throws away everything you don't need, assuming that 'predicate'
// tests a scalar value to say whether you need that scalar value.
function prunePOJO(predicate, pojo) {
  assert(isPOJO(pojo));
  if (isScalar(pojo)) {
    return pojo;
  } else if (pojo instanceof Array) {
    let result = [];
    for (let i = 0; i < pojo.length; i++) {
      let subPojo = prunePOJO(predicate, pojo[i]);
      if (isScalar(subPojo)) {
        if (predicate(subPojo)) {
          result.push(subPojo);
        }
      } else if (subPojo instanceof Array) {
        if (subPojo.length > 0) {
          result.push(subPojo);
        }
      } else {
        // subPojo is a plain object, depending on the assumption that it is a POJO
        if (Object.keys(subPojo).length > 0) {
          result.push(subPojo);
        }
      }
    }
    return result;
  } else {
    // pojo is a plain object, depending on the assumption that it is a POJO
    let result = {};
    for (let key in pojo) {
      let subPojo = prunePOJO(predicate, pojo[key]);
      if (isScalar(subPojo)) {
        if (predicate(subPojo)) {
          result[key] = subPojo;
        }
      } else if (subPojo instanceof Array) {
        if (subPojo.length > 0) {
          result[key] = subPojo;
        }
      } else {
        // subPojo is a plain object, depending on the assumption that it is a POJO
        if (Object.keys(subPojo).length > 0) {
          result[key] = subPojo;
        }
      }
    }
    return result;
  }
}

// coprunePOJO reverses the process carried out by prunePOJO. It assumes that prunedPojo
// is structurally congruent to prunePOJO(predicate, originalPojo). It returns a new POJO,
// call it coprunedPojo, such that prunePOJO(predicate, coprunedPojo) is deep-equal to prunedPojo,
// coprunedPojo is structurally congruent to originalPojo, and the values for the scalars which
// are taken out by prunePOJO(predicate, coprunedPojo) are drawn from the same locations in
// originalPojo.
function coprunePOJO(predicate, originalPojo, prunedPojo) {

}

export { prunePOJO, coprunePOJO }
