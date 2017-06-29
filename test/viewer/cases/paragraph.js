import { makeParagraph } from '../../../src/velements/paragraph.js';
import { BLACK, WHITE, RED, GREEN } from '../../lib/colors.js';
import { makeTestBox } from '../../lib/test-box.js';
import { makeSoftConstraintField } from '../../../src/scalar-fields/soft-constraint-field.js';
import { makeNonNegativeConstraintField } from '../../../src/scalar-fields/non-negative-constraint-field.js';
import { sumDifferentiableScalarFields } from '../../../src/compose-differentiable-scalar-fields.js';
import { makeConstantScalarField } from '../../../src/differentiable-scalar-field.js';

let wantHeight = 
    makeSoftConstraintField(
      { height: 0, width: 0 },
      [[1,['height'],100]],
      1);

const rigidBox100 = {
  velement: makeTestBox(GREEN, wantHeight),
  optimalWidth: 100,
  isRigid: true,
  isBreakpoint: false
};

const rigidBox200 = {
  velement: makeTestBox(BLACK, wantHeight),
  optimalWidth: 200,
  isRigid: true,
  isBreakpoint: false
};

let spaceWidthPreference = makeSoftConstraintField({ height: 0, width: 0 },
                                                   [[1,['width'],100]],
                                                   10);

let spaceWidthNonNegative = makeNonNegativeConstraintField({ height: 0, width: 0 },
                                                           ['width'],
                                                           10000000)

let breakWidthPreference = makeSoftConstraintField({ height: 0, width: 0 },
                                                   [[1,['width'],0]],
                                                   10000000);

let spaceObjective = sumDifferentiableScalarFields(
  //spaceWidthPreference, 
  spaceWidthNonNegative, 
  wantHeight
);

let fill = makeConstantScalarField({ height: 0, width: 0 }, 0);

const space = {
  velement: makeTestBox(RED, spaceObjective),
  optimalWidth: 100,
  isRigid: false,
  isBreakpoint: true,
  preBreakBox: {
    velement: makeTestBox(WHITE, breakWidthPreference),
    optimalWidth: 0,
    isRigid: false,
    isBreakpoint: false
  }
};

const endingSpace = {
  velement: makeTestBox(WHITE, spaceWidthNonNegative),
  optimalWidth: 0,
  isRigid: false,
  isBreakpoint: false
}

export default makeParagraph([
  rigidBox100,
  rigidBox200,
  space,
  rigidBox100,
  space,
  rigidBox100,
  space,
  rigidBox100,
  space,
  rigidBox200,
  space,
  rigidBox200,
  rigidBox100,
  endingSpace
]);
