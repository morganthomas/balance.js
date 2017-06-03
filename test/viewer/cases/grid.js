import { makePaddingBox } from '../../../src/velements/padding-box.js';
import { makeGrid } from '../../../src/velements/grid.js';
import { BLACK } from '../../lib/colors.js';
import { makeTestBox } from '../../lib/test-box.js';

let testBox = makePaddingBox(5, makeTestBox(BLACK));

export default makeGrid({ children: [[testBox, testBox], [testBox, testBox]] });
