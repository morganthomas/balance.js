import assert from 'assert';
import { isPOJO, isScalar } from './pojo.js';

function isPath(x) {
  return x instanceof Array &&
    x.every(y => typeof y === 'number' || typeof y === 'string');
}

// ASSUMES pojo is a POJO and path is an array of numbers and/or strings.
// Treats path as a sequence of keys and follows them into pojo.
function pathLookup(pojo, path) {
  assert(isPOJO(pojo));
  assert(path instanceof Array);

  return pathLookupRecurse(pojo, path, 0);
}

function pathLookupRecurse(pojo, path, index) {
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

function setAtPath(object, path, value) {
  assert(isPath(path));
  assert(path.length > 0);
  setAtPathTraverse(object, path, value, 0);
}

function setAtPathTraverse(object, path, value, index) {
  if (index + 1 === path.length) {
    object[path[index]] = value;
  } else {
    assert(object.hasOwnProperty(path[index]));
    setAtPathTraverse(object[path[index]], path, value, index+1)
  }
}

export {
  isPath,
  pathLookup,
  setAtPath,
}
