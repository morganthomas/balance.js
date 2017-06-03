import { makeTestBox } from '../../lib/test-box.js';
import { BLACK } from '../../lib/colors.js';
import { makePaddingBox } from '../../../src/velements/padding-box.js';

export default makePaddingBox(5, makeTestBox(BLACK));
