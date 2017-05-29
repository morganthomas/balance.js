import { mapScalars, addPONJOs } from '../pojo.js';
import {
  expandDomainOfDifferentiableScalarField, 
  sumDifferentiableScalarFields
} from '../compose-differentiable-scalar-fields.js';
import { constrainOptimizationProblem } from '../constrain-optimization-problem.js';
import { makeSoftConstraintField } from '../scalar-fields/soft-constraint-field.js';

const plus = (x,y) => x+y;

function makeHBox(options) {
  let velements = options.children;

  let unconstrainedDomainRepresentative = {
    children: velements
      .map(el => el.layoutProblem.objectiveFunction.domainRepresentative),
    width: 0,
    height: 0
  };

  let widthConstraintField = makeSoftConstraintField(
    unconstrainedDomainRepresentative,
    [[1,['width']]].concat(velements.map((e,i) => [-1,['children',i,'width']])));

  let unconstrainedScalarField = sumDifferentiableScalarFields(
    widthConstraintField,
    ...velements.map(
      (e,i) => expandDomainOfDifferentiableScalarField(
        e.layoutProblem.objectiveFunction,
        unconstrainedDomainRepresentative,
        ['children',i])
    )
  );

  let unconstrainedOptimizationProblem = {
    objectiveFunction: unconstrainedScalarField,
    initialGuessFunction(c) {
      let childrenGuesses = velements.map((e,i) => e.layoutProblem.initialGuessFunction(c.children[i]));
      let width = c.width || childrenGuesses.map(g => g.width).reduce(plus, 0);
      let height = c.height || childrenGuesses.map(g => g.height).reduce(plus, 0) / childrenGuesses.length;

      return {
        children: childrenGuesses,
        width,
        height
      };
    }
  };

  let layoutProblem = constrainOptimizationProblem(
    unconstrainedOptimizationProblem,
    [[['height']].concat(velements.map((e,i) => ['children', i, 'height']))]
  );

  function render(sln) {
    sln = layoutProblem.unconstrainPONuNJO(sln);
    let childWidths = sln.children.map(a => a.width);
    let childStartPositions = [];

    let pos = 0;
    for (let i = 0; i < sln.children.length; i++) {
      childStartPositions.push(pos);
      pos += childWidths[i];
    }

    return velements.map((e,i) => {
      return {
        translate: {
          what: e.render(sln.children[i]),
          by: { y: 0, x: childStartPositions[i] }
        }
      };
    });
  };

  return {
    layoutProblem,
    render
  };
}

export { makeHBox }
