import { makePaddingBox } from '../../../src/velements/padding-box.js';
import { makeHBox } from '../../../src/velements/hbox.js';
import { makeSoftConstraintField } from '../../../src/scalar-fields/soft-constraint-field.js';
import { BLACK } from '../colors.js';
import { makeTestBox } from '../make-test-box.js';

let testBox1 = makePaddingBox(5, makeTestBox(BLACK));
let testBox2 = 
    makePaddingBox(
      5, 
      makeTestBox(
        BLACK,
        makeSoftConstraintField(
          { width: 0, height: 0 },
          [[1,['width'],100]]
        )
      )
    );

export default makeHBox({ children: [testBox1, testBox2, testBox1] });
