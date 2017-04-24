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
          // in this case position[key] === true and we don't need to do anything
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

export {
  arrayToPathSet
};
