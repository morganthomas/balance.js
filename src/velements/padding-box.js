import assert from 'assert';
import { mapScalars, POJOsAreStructurallyCongruent, zipPOJOs, addPONJOs } from '../pojo.js';
import { translateDifferentiableScalarField } from '../compose-differentiable-scalar-fields.js';

// Takes a box velement 'child' and produces a new box velement which is 'child'
// surrounded by paddingWidth padding on all sides. TODO: allow one-side padding
// or multi-side padding
function makePaddingBox(paddingWidth, child) {
  let domainRepresentative = child.layoutProblem.objectiveFunction.domainRepresentative;
  let paddingPerAxis = -(paddingWidth * 2);
  let translationVector = mapScalars(() => 0, domainRepresentative);
  translationVector.width = paddingPerAxis;
  translationVector.height = paddingPerAxis;
  let inverseTranslationVector = mapScalars(x => -x, translationVector);

  return {
    layoutProblem: {
      objectiveFunction: translateDifferentiableScalarField(
        child.layoutProblem.objectiveFunction,
        translationVector),

      initialGuessFunction(constraints) {
        assert(POJOsAreStructurallyCongruent(constraints, domainRepresentative));
        let zipper = (c, t) => c === null ? null : c + t;
        let translatedConstraints = zipPOJOs(zipper, constraints, translationVector);
        let childGuess = child.layoutProblem.initialGuessFunction(translatedConstraints);
        let guess = addPONJOs(childGuess, inverseTranslationVector);
        return guess;
      }
    },

    render(sln) {
      let childSln = addPONJOs(sln, translationVector);
      return {
        translate: {
          what: child.render(childSln),
          by: { x: paddingWidth, y: paddingWidth }
        }
      };
    }
  }
}

export { makePaddingBox }
