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

debugger;

describe('solveLinePackingProblem', () => {
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
  
  function checkSolve(solve) {
    let lengths1 = (i) => i === 1 ? 425 : 350;
    let solution1 = solve(lengths1);
    expect(solution1).to.eql({
      breakpointList: [4,7],
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
            { height: 0, width: 49.99999999999935 },
            { height: 0, width: 100 }
          ],
          solutionBadnesses: [0, 0, 0, 0],
          length: 350,
          badness: 4.652890945610781e-22,
          postBreakBox: undefined
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
            { height: 0, width: 124.99999999999838 }
          ],
          solutionBadnesses: [0, 0, 0],
          length: 425,
          badness: 2.5332406259436473e-21,
          postBreakBox: undefined
        }
      ],
      badness: 2.9985297205047253e-21,
      isTolerable: true,
      postBreakBox: undefined
    });
  }

  it('works on a simple case with non-exhaustive search', () => {
    let solve = solveLinePackingProblem(boxes, { maxThreads: 2 });
    for (let i = 0; i < 10; i++) {
      checkSolve(solve);
    }
  });

  it('works on a simple case with exhaustive search', () => {
    let solve = solveLinePackingProblem(boxes, { maxThreads: Infinity });
    for (let i = 0; i < 10; i++) {
      checkSolve(solve);
    }
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
        { height: 0, width: 24.999999999999677 },
        { height: 0, width: 100 }
      ],
      solutionBadnesses: [0, 0, 0],
      length: 225,
      badness: 1.1632227364026952e-22,
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
        { height: 0, width: 99.9999999999987 },
        { height: 0, width: 100 },
        { height: 0, width: 100 },
      ],
      solutionBadnesses: [0, 0, 0, 0],
      length: 400,
      badness: 1.709291187658405e-21,
      postBreakBox: rigidBox100
    });
  });
});
