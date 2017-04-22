import { expect } from 'chai';
import { mapScalars } from '../src/pojo.js';
import { solveOptimizationProblem } from '../src/optimization-problem.js';

describe('solveOptimizationProblem', function() {
  it('works on a simple problem', function() {
    let problem = {
      objectiveFunction: {
        inputClassRepr: {
          x: 0,
          y: 0,
          z: [0,0]
        },

        valueAt(input) {
          return input.x * input.x + input.y * input.y + input.z[0] * input.z[1];
        },

        gradientAt(input) {
          return {
            x: 2 * input.x,
            y: 2 * input.y,
            z: [input.z[1], input.z[0]]
          };
        },
      },

      initialGuessFunction(constraints) {
        return mapScalars(x => x === null ? 5.0 : x, constraints);
      },
    };

    let constraints = {
      x: null,
      y: null,
      z: [null, null]
    };

    let solution = solveOptimizationProblem(problem, constraints);

    expect(solution).to.eql({ x: 0.0, y: 0.0, z: [0.0, 0.0] });
  });
});
