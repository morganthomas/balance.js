import { makePaddingBox } from '../../../src/velements/padding-box.js';
import { makeHBox } from '../../../src/velements/hbox.js';
import { BLACK } from '../../lib/colors.js';
import { makeTestBox } from '../../lib/test-box.js';

let testBox = makePaddingBox(5, makeTestBox(BLACK));

export default makeHBox({ children: [testBox, testBox] });
