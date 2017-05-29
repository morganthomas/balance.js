import { makePaddingBox } from '../../../src/velements/padding-box.js';
import { makeHBox } from '../../../src/velements/hbox.js';
import { BLACK } from '../colors.js';
import { makeTestBox } from '../make-test-box.js';

let testBox1 = makePaddingBox(5, makeTestBox(BLACK));
let testBox2 = makePaddingBox(5, makeTestBox(BLACK));

export default makeHBox(testBox1, testBox2);
