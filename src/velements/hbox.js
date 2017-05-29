import { mapScalars, addPONJOs } from '../pojo.js';
import { composeDifferentiableScalarFields } from '../compose-differentiable-scalar-fields.js';
import { constrainOptimizationProblem } from '../constrain-optimization-problem.js';

const plus = (x,y) => x+y;
const WIDTH_DEVIATION_BADNESS_INTENSITY = 1000;
const INTENSITY = WIDTH_DEVIATION_BADNESS_INTENSITY;

function makeHBox(...velements) {
  let unconstrainedDomainRepresentative = {
    children: velements
      .map(el => el.layoutProblem.objectiveFunction.domainRepresentative),
    width: 0,
    height: 0
  };

  let unconstrainedScalarField = composeDifferentiableScalarFields({
    domainRepresentative: unconstrainedDomainRepresentative,
    subfields: velements.map(el => el.layoutProblem.objectiveFunction),
    inputMappings: velements.map((el, i) => ((x) => x.children[i])),

    valueAt(x, subfieldValues) {
      let childrenBadness = subfieldValues.reduce(plus, 0);
      let childrenWidthSum = x.children.map(s => s.width).reduce(plus, 0);
      let widthDeviation = x.width - childrenWidthSum;
      let widthDeviationBadness = INTENSITY * widthDeviation * widthDeviation;
      return childrenBadness + widthDeviationBadness;
    },

    gradientAt(x, subfieldValues, subfieldGradients) {
      let widthDeviationGradient = mapScalars(() => 0, unconstrainedDomainRepresentative);
      widthDeviationGradient.width = 2 * INTENSITY * x.width 
        - 2 * INTENSITY * x.children.map(s => s.width).reduce(plus, 0);
      for (let i = 0; i < x.children.length; i++) {
        widthDeviationGradient.children[i].width = 2 * INTENSITY * x.children[i].width
          - 2 * INTENSITY * (
            x.width -
              x.children.map((s,j) => j === i ? 0 : s.width).reduce(plus, 0)
          );
      }

      let subfieldsGradient = {
        width: 0,
        height: 0,
        children: subfieldGradients
      };

      return addPONJOs(widthDeviationGradient, subfieldsGradient);
    }
  });

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
