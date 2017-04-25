import { expect } from 'chai';
import { mapScalars } from '../src/pojo.js';
import {
  constrainOptimizationProblem, 
  getPathsToPrune
} from '../src/constrain-optimization-problem.js';

describe('getPathsToPrune', function() {
  it('gives the expected outputs', function() {
    expect(getPathsToPrune([])).to.eql([]);
    expect(getPathsToPrune([[[0]]])).to.eql([]);
    expect(getPathsToPrune([[[0],[3]]])).to.eql([[3]]);
    expect(getPathsToPrune([[[1],[3],[0]]])).to.eql([[3],[0]]);
    expect(getPathsToPrune([[[0,0]]])).to.eql([]);
    expect(getPathsToPrune([[[0],[1,3]]])).to.eql([[1,3]]);
    expect(getPathsToPrune([[[0],[3]], [[0],[1,3], [0,0]]])).to.eql([[3],[1,3],[0,0]]);
    expect(getPathsToPrune([[['a'],[0,'b'],['c','c',13]]])).to.eql([[0,'b'],['c','c',13]]);
    expect(getPathsToPrune([[['a'],0]])).to.eql([['a']]);
    expect(getPathsToPrune([[['c']], [['a'],[0,'b'],function(){}]])).to.eql([['a'],[0,'b']]);
  });
});

describe('constrainOptimizationProblem', function() {
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
    [[['x'], ['y']], [['z', 0], ['z', 1]]],
    [[['x'], ['y'], 13]],
  ];

  let constrainedProblems = constraintsList.map(
    constraints => constrainOptimizationProblem(problem, constraints));

  let expectedRepresentatives = [
    { x: 0, y: 0, z: [0, 0] },
    { x: 0, z: [0, 0] },
    { x: 0, z: [0] },
    { z: [0, 0] },
  ];
  
  it('gives the expected domain representatives', function() {
    constrainedProblems.forEach(
      (problem, i) => expect(problem.objectiveFunction.domainRepresentative)
        .to.eql(expectedRepresentatives[i]));
  });

  let samplePONJO = { x: 3, y: 16, z: [9, 12] };

  let expectedConstrainPONuNJOoutputs = [
    // []
    { x: 3, y: 16, z: [9, 12] },
    // [[['x'], ['y']]]
    { x: 3, z: [9, 12] },
    // [[['x'], ['y']], [['z', 0], ['z', 1]]]
    { x: 3, z: [9] },
    // [[['x'], ['y'], 13]]
    { z: [9, 12] },
  ];

  it('gives a constrainPONuNJO with the expected behavior', function() {
    constrainedProblems.forEach(
      (problem, i) => expect(problem.constrainPONuNJO(samplePONJO))
        .to.eql(expectedConstrainPONuNJOoutputs[i]));
  });

  let expectedUnconstrainPONuNJOoutputs = [
    // []
    // { x: 3, y: 16, z: [9, 12] },
    { x: 3, y: 16, z: [9, 12] },
    // [[['x'], ['y']]]
    // { x: 3, z: [9, 12] },
    { x: 3, y: 3, z: [9, 12] },
    // [[['x'], ['y']], [['z', 0], ['z', 1]]]
    // { x: 3, z: [9] },
    { x: 3, y: 3, z: [9, 9] },
    // [[['x'], ['y'], 13]]
    // { z: [9, 12] },
    { x: 13, y: 13, z: [9, 12] }
  ];

  it('gives an unconstrainPONuNJO with the expected behavior', function() {
    constrainedProblems.forEach(function(problem, i) {
      let constrained = problem.constrainPONuNJO(samplePONJO);
      let unconstrained = problem.unconstrainPONuNJO(constrained);
      let expected = expectedUnconstrainPONuNJOoutputs[i];
      expect(unconstrained).to.eql(expected);
    });
  });

  it('gives a valueAt with the expected behavior', function() {
    constrainedProblems.forEach(function(constrainedProblem, i) {
      let unconstrainedInput = expectedUnconstrainPONuNJOoutputs[i];
      let constrainedInput = expectedConstrainPONuNJOoutputs[i];
      expect(problem.objectiveFunction.valueAt(unconstrainedInput))
        .to.equal(constrainedProblem.objectiveFunction.valueAt(constrainedInput));
    });
  });
});
