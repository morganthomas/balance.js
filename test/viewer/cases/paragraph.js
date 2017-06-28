import { makeParagraph } from '../../../src/velements/paragraph.js';
import { BLACK, WHITE } from '../../lib/colors.js';
import { makeTestBox } from '../../lib/test-box.js';
import { makeSoftConstraintField } from '../../../src/scalar-fields/soft-constraint-field.js';
import { makeNonNegativeConstraintField } from '../../../src/scalar-fields/non-negative-constraint-field.js';
import { sumDifferentiableScalarFields } from '../../../src/compose-differentiable-scalar-fields.js';

let wantHeight = 
    makeSoftConstraintField(
      { height: 0, width: 0 },
      [[1,['height'],100]],
      1);

const rigidBox100 = {
  velement: makeTestBox(BLACK, wantHeight),
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

const space = {
  velement: makeTestBox(BLACK,
                        sumDifferentiableScalarFields([
                          makeSoftConstraintField({ height: 0, width: 0 },
                                                  [[1,['width'],100]],
                                                  100),
                          makeNonNegativeConstraintField({ height: 0, width: 0 },
                                                         ['width'],
                                                         1000)
                        ])),
  optimalWidth: 100,
  isRigid: false,
  isBreakpoint: true
};

export default makeParagraph([
  rigidBox100,
  rigidBox200,
  space,
  rigidBox100,
  space,
  rigidBox100,
  rigidBox100,
  space,
  rigidBox200,
  space,
  rigidBox200,
  rigidBox100,
  space
]);
