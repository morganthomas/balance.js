import { makeTestBox } from '../make-test-box.js';
import { BLACK } from '../colors.js';
import { makePaddingBox } from '../../../src/velements/padding-box.js';

export default makePaddingBox(5, makeTestBox(BLACK));
