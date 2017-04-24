/*

Path sets are an efficient way of representing finite sets of non-empty paths (see path.js).
A non-empty path is in other words a path with at least one element.

arrayToPathSet(paths)
  Takes an array of non-empty paths and returns the set of those paths.

pathSetContains(set, path);
  Returns true if the given path set contains the given path.

pathSetToArray(set)
  Returns an array of the paths in the given path set.

*/

import assert from 'assert';
import { isScalar } from './pojo.js';
import { isPath } from './path.js';

function arrayToPathSet(paths) {
  assert(paths instanceof Array);
  assert(paths.every(path => isPath(path) && path.length > 0));

  let result = {};

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    let position = result;
    for (let j = 0; j < path.length; j++) {
      let key = path[j];
      if (j + 1 === path.length) {
        // this is the last key in the path
        if (!position.hasOwnProperty(key)) {
          position[key] = true;
        } else if (position[key] instanceof Array) {
          position[key][0] = true;
        } else {
          throw 'this line should be unreachable';
        }
      } else {
        // this is not the last key in the path
        if (!position.hasOwnProperty(key) || position[key] === true) {
          let newPosition = {};
          position[key] = [position[key] || false, newPosition];
          position = newPosition;
        } else {
          // in this case: position[key] instanceof Array
          position = position[key][1];
        }
      }
    }
  }

  return result;
}

function pathSetContains(set, path) {
  assert(isPath(path));

  if (path.length === 0) {
    return false;
  } else {
    let position = set;
    for (let i = 0; i < path.length; i++) {
      let key = path[i];
      if (position.hasOwnProperty(key)) {
        let value = position[key];
        if (value === true) {
          return i + 1 === path.length;
        } else {
          if (i + 1 === path.length) {
            return value[0];
          } else {
            position = value[1];
          }
        }
      } else {
        return false;
      }
    }
    throw 'the end of pathSetContains should be unreachable';
  }
}

function pathSetToArray(set) {
  let result = [];
  pathSetToArrayTraverse(set, [], result);
  return result;
}

const nonNegativeIntegerRegex = /^[0-9]+$/;

function pathSetToArrayTraverse(position, path, result) {
  for (let key in position) {
    if (nonNegativeIntegerRegex.test(key)) {
      key = parseInt(key);
    }
    let subPath = path.concat(key);
    if (position[key] === true) {
      result.push(subPath);
    } else {
      if (position[key][0] === true) {
        result.push(subPath);
      }
      pathSetToArrayTraverse(position[key][1], subPath, result);
    }
  }
}

export {
  arrayToPathSet,
  pathSetContains,
  pathSetToArray,
};
