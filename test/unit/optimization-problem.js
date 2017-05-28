import { expect } from 'chai';
import { mapScalars, POJOsAreStructurallyCongruent } from '../../src/pojo.js';
import { flattenPOJO } from '../../src/flatten-pojo.js';
import { solveOptimizationProblem } from '../../src/optimization-problem.js';

describe('solveOptimizationProblem', function() {
  it('works on a simple problem', function() {
    let problem = {
      objectiveFunction: {
        domainRepresentative: {
          x: 0,
          y: 0,
          z: [0,0]
        },

        valueAt(input) {
          return input.x * input.x + input.y * input.y +
            input.z[0] * input.z[0] * input.z[1] * input.z[1];
        },

        gradientAt(input) {
          return {
            x: 2 * input.x,
            y: 2 * input.y,
            z: [2 * input.z[1] * input.z[1] * input.z[0], 
                2 * input.z[0] * input.z[0] * input.z[1]]
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

    expect(problem.initialGuessFunction(constraints)).to.eql({
      x: 5.0,
      y: 5.0,
      z: [5.0, 5.0]
    });

    let solution = solveOptimizationProblem(problem);

    let idealSolution = {
      x: 0.0,
      y: 0.0,
      z: [0.0, 0.0],
    };

    let error = flattenPOJO(solution)
        .map((x) => Math.abs(x))
        .reduce((a,b) => a + b, 0);

    expect(error).to.be.below(0.001);
    expect(solution).to.satisfy(
      (s) => POJOsAreStructurallyCongruent(s, idealSolution));

    constraints = {
      x: null,
      y: null,
      z: [-3, 7]
    };

    expect(problem.initialGuessFunction(constraints)).to.eql({
      x: 5.0,
      y: 5.0,
      z: [-3.0, 7.0]
    });

    solution = solveOptimizationProblem(problem, constraints);

    idealSolution = {
      x: 0.0,
      y: 0.0,
      z: [-3.0, 7.0]
    };

    error = flattenPOJO(solution)
      .map((x) => Math.abs(x))
      .reduce((a,b) => a + b, 0);

    expect(error).to.be.below(1);
    expect(solution).to.satisfy(
      (s) => POJOsAreStructurallyCongruent(s, idealSolution));
  });
});
