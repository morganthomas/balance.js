import { makeParagraph } from '../../../src/velements/paragraph.js';
import { BLACK } from '../../lib/colors.js';
import { makeTestBox } from '../../lib/test-box.js';
import { makeSoftConstraintField } from '../../../src/scalar-fields/soft-constraint-field.js';

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

const nonBreakingFillBox = {
  velement: makeTestBox(BLACK),
  optimalWidth: 200,
  isRigid: false,
  isBreakpoint: false
};

const breakingFillBox = {
  velement: makeTestBox(BLACK),
  optimalWidth: 200,
  isRigid: false,
  isBreakpoint: false
};

export default makeParagraph([
  rigidBox100,
  rigidBox200,
  nonBreakingFillBox,
  rigidBox100,
  breakingFillBox,
  rigidBox100,
  breakingFillBox,
  rigidBox100,
  rigidBox200,
  breakingFillBox,
  rigidBox200,
  rigidBox100,
  breakingFillBox
]);
