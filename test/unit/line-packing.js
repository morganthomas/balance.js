import { expect } from 'chai';
import { breakBoxes } from '../../src/line-packing.js';

const boxes1 = [
  { // 0
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: false
  },
  { // 1
    boxType: 'elastic',
    optimalLength: 100,
    isBreakpoint: false,
  },
  { // 2
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: false
  },
  { // 3
    boxType: 'rigid',
    optimalLength: 0,
    isBreakpoint: true,
    preBreakBox: {
      boxType: 'fill'
    }
  },
  { // 4
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: false
  },
  { // 5
    boxType: 'fill',
    isBreakpoint: false
  },
  { // 6
    boxType: 'elastic',
    optimalLength: 50,
    isBreakpoint: false
  },
  { // 7
    boxType: 'rigid',
    optimalLength: 25,
    isBreakpoint: false
  },
  { // 8
    boxType: 'elastic',
    optimalLength: 50,
    isBreakpoint: true
  },
  { // 9
    boxType: 'rigid',
    optimalLength: 200,
    isBreakpoint: false
  },
  { // 10
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: true,
    preBreakBox: {
      boxType: 'fill'
    },
    postBreakBox: {
      boxType: 'rigid',
      optimalLength: 50
    }
  },
  { // 11
    boxType: 'fill',
    optimalLength: 100,
    isBreakpoint: false
  }
];

describe('breakBoxes', () => {
  it('works on boxes1', () => {
    expect(breakBoxes(boxes1, [3, 8, 10])).to.eql([
      [
        boxes1[0],
        boxes1[1],
        boxes1[2],
        boxes1[3].preBreakBox
      ],
      [
        boxes1[4],
        boxes1[5],
        boxes1[6],
        boxes1[7]
      ],
      [
        boxes1[9],
        boxes1[10].preBreakBox
      ],
      [
        boxes1[10].postBreakBox,
        boxes1[11]
      ]
    ]);

    expect(breakBoxes(boxes1, [3, 10])).to.eql([
      [
        boxes1[0],
        boxes1[1],
        boxes1[2],
        boxes1[3].preBreakBox
      ],
      [
        boxes1[4],
        boxes1[5],
        boxes1[6],
        boxes1[7],
        boxes1[8],
        boxes1[9],
        boxes1[10].preBreakBox
      ],
      [
        boxes1[10].postBreakBox,
        boxes1[11]
      ]
    ]);

    expect(breakBoxes(boxes1, [10])).to.eql([
      [
        boxes1[0],
        boxes1[1],
        boxes1[2],
        boxes1[3],
        boxes1[4],
        boxes1[5],
        boxes1[6],
        boxes1[7],
        boxes1[8],
        boxes1[9],
        boxes1[10].preBreakBox
      ],
      [
        boxes1[10].postBreakBox,
        boxes1[11]
      ]
    ]);
  });
});

describe('createLinePackingPathOptimizationProblem', () => {
  //const problem = createLinePackingPathOptimizationProblem(boxes1);
});
