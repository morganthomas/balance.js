import { expect } from 'chai';
import { testBoxes } from '../lib/line-packing.js';
import { solveLinePackingProblem, createLine } from '../../src/line-packing.js';

const rigidBox100 = testBoxes.rigidBox100;
const rigidBox200 = testBoxes.rigidBox200;
const nonBreakingFillBox = testBoxes.nonBreakingFillBox;
const breakingFillBox = testBoxes.breakingFillBox;
const breakingFillBoxWithPreAndPost = testBoxes.breakingFillBoxWithPreAndPost;

let velements = {};
for (let boxName in testBoxes) {
  velements[boxName] = testBoxes[boxName].velement;
}

describe('solveLinePackingProblem', () => {
  it('works on a simple case', () => {
    let boxes = [
      rigidBox100,
      rigidBox100,
      nonBreakingFillBox,
      rigidBox100,
      breakingFillBox,
      rigidBox100,
      rigidBox200,
      nonBreakingFillBox
    ];

    let solve = solveLinePackingProblem(boxes);

    let lengths1array = [350, 425];
    let lengths1 = (i) => lengths1array[i];
    let solution1 = solve(lengths1);
    expect(solution1).to.eql({
      breakpointList: [4],
      lines: [
        {
          velements: [
            velements.rigidBox100,
            velements.rigidBox100, 
            velements.nonBreakingFillBox,
            velements.rigidBox100
          ],
          layoutSolutions: [
            { height: 0, width: 100 },
            { height: 0, width: 100 },
            { height: 0, width: 50 },
            { height: 0, width: 100 }
          ],
          solutionBadnesses: [0, 0, 0, 0],
          length: 350,
          badness: 0
        },
        {
          velements: [
            velements.rigidBox100,
            velements.rigidBox200,
            velements.nonBreakingFillBox
          ],
          layoutSolutions: [
            { height: 0, width: 100 },
            { height: 0, width: 200 },
            { height: 0, width: 125 }
          ],
          solutionBadnesses: [0, 0, 0],
          length: 350,
          badness: 0
        }
      ],
      badness: 0,
      isTolerable: true,
      postBreakBox: undefined
    });
  });
});

describe('createLine', () => {
  it('works on a simple case', () => {
    let boxes = [
      rigidBox100,
      nonBreakingFillBox,
      rigidBox100
    ];
    let line = createLine(boxes, 225);
    expect(line).to.eql({
      velements: [
        velements.rigidBox100,
        velements.nonBreakingFillBox,
        velements.rigidBox100
      ],
      layoutSolutions: [
        { height: 0, width: 100 },
        { height: 0, width: 25 },
        { height: 0, width: 100 }
      ],
      solutionBadnesses: [0, 0, 0],
      length: 225,
      badness: 0,
      postBreakBox: undefined
    });
  });

  it('works with a post break box', () => {
    let boxes = [
      rigidBox100,
      nonBreakingFillBox,
      rigidBox100,
      breakingFillBoxWithPreAndPost
    ];
    let line = createLine(boxes, 400);
    expect(line).to.eql({
      velements: [
        velements.rigidBox100,
        velements.nonBreakingFillBox,
        velements.rigidBox100,
        velements.rigidBox100
      ],
      layoutSolutions: [
        { height: 0, width: 100 },
        { height: 0, width: 100 },
        { height: 0, width: 100 },
        { height: 0, width: 100 },
      ],
      solutionBadnesses: [0, 0, 0, 0],
      length: 400,
      badness: 0,
      postBreakBox: rigidBox100
    });
  });
});
