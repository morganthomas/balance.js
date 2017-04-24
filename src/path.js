import assert from 'assert';
import { isPOJO, isScalar } from './pojo.js';

// ASSUMES pojo is a POJO and path is an array of numbers and/or strings.
// Treats path as a sequence of keys and follows them into pojo.
function pathLookup(pojo, path) {
  return pathLookupRecurse(pojo, path, 0);
}

function pathLookupRecurse(pojo, path, index) {
  assert(isPOJO(pojo));
  assert(path instanceof Array);

  if (path.length <= index) {
    return pojo;
  } else {
    let key = path[index];
    assert(!isScalar(pojo));
    if (pojo instanceof Array) {
      assert(typeof key === 'number');
      assert(Math.round(key) === key);
      assert(key >= 0);
      assert(key < pojo.length);
      return pathLookupRecurse(pojo[key], path, index+1);
    } else {
      // pojo is a plain object depending the assumption it is a POJO
      assert(typeof key === 'string');
      assert(pojo.hasOwnProperty(key));
      return pathLookupRecurse(pojo[key], path, index+1);
    }
  }
}

export {
  pathLookup,
}