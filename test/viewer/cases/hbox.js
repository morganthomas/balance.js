import { makePaddingBox } from '../../../src/velements/padding-box.js';
import { makeHBox } from '../../../src/velements/hbox.js';
import { BLACK } from '../colors.js';
import { makeTestBox } from '../make-test-box.js';

let testBox = makePaddingBox(5, makeTestBox(BLACK));

export default makeHBox(testBox, testBox);
