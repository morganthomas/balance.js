import { expect } from 'chai';
import { mapScalars } from '../src/pojo.js';
import { constrainOptimizationProblem } from '../src/constrain-optimization-problem.js';

describe('constrainOptimizationProblem', function() {
  it('gives the expected output on a simple case', function() {
    let objectiveFunction = {
      domainRepresentative: {
        x: 0,
        y: 0,
        z: [0, 0]
      },
      valueAt: (v) => v.x + v.y + v.z[0] * v.z[1],
      gradientAt: (v) => ({
        x: 1,
        y: 1,
        z: [v.z[1], v.z[0]]
      })
    };

    let initialGuessFunction = function(constraints) {
      return mapScalars(x => x === null ? 0.0 : x, constraints);
    };

    let problem = {
      objectiveFunction,
      initialGuessFunction
    };

    let constraintsList = [
      [],
      [[['x'], ['y']]],
      [[['x'], ['z', 0]]],
      [[['x'], ['y']], [['z', 0], ['z', 1]]],
    ];
  });
});
