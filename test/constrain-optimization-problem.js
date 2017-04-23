import { expect } from 'chai';
import { mapScalars } from '../src/pojo.js';
import {
  constrainOptimizationProblem, 
  getFieldsToKill 
} from '../src/constrain-optimization-problem.js';

describe('getPathsToPrune', function() {
  it('gives the expected outputs', function() {
    expect(getPathsToPrune([])).to.eql([]);
    expect(getPathsToPrune([[[0]]])).to.eql([]);
    expect(getPathsToPrune([[[0],[3]]])).to.eql([[3]]);
    expect(getPathsToPrune([[[1],[3],[0]]])).to.eql([[3],[0]]);
    expect(getPathsToPrune([[[0,0]]])).to.eql([]);
    expect(getPathsToPrune([[[0],[1,3]]])).to.eql([[1,3]]);
    expect(getPathsToPrune([[[0],[3]], [[0],[1,3]], [0,0]])).to.eql([[3],[1,3]]);
    expect(getPathsToPrune([[['a'],[0,'b'],['c','c',13]]])).to.eql([[[0,'b'],['c','c',13]]]);
    expect(getPathsToPrune([[['a'],0]])).to.eql([['a']]);
  });
});

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

    let constrainedProblems = constraintsList.map(
      constraints => constrainOptimizationProblem(problem, constraints));

    let expectedRepresentatives = [
      { x: 0, z: [0, 0] },
      { x: 0, y: 0, z: [0] },
      { x: 0, z: [0] }
    ];

    constrainedProblems.forEach(
      (problem, i) => expect(problem.objectiveFunction.domainRepresentative)
        .to.eql(expectedRepresentatives[i]));
  });
});
