import { expect } from 'chai';
import { solvePathOptimizationProblem } from '../../src/path-optimization.js';
import { deepEquals } from '../../src/pojo.js';

describe('solvePathOptimizationProblem', () => {
  it('works on a simple case', () => {
    // In this path optimization problem, the paths are arrays of numbers.
    // The initial path is an empty array. The advance function appends a
    // number, one through four. It considers a path complete when the path
    // has length five. The utility of a path is the sum of its members.
    // A path is considered feasible when it doesn't contain the number 1.
    // Therefore the optimal solution is the path [2,2,2,2,2].
    let pathOptimizationProblem = {
      initialPath: [],

      advance(path) {
        if (path.length >= 5) {
          return [path];
        } else {
          return [
            path.concat([1]),
            path.concat([2]),
            path.concat([3]),
            path.concat([4])
          ];
        }
      },

      isFeasible(path) {
        return path.every(el => el !== 1);
      },

      utility(path) {
        return path.reduce((a,b) => a + b, 0);
      },

      maxThreads: Infinity,

      pathsAreEqual: deepEquals
    };

    let solution = solvePathOptimizationProblem(pathOptimizationProblem);

    expect(solution).to.eql([2,2,2,2,2]);
  });
});
