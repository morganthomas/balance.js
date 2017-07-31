import { expect } from 'chai';

const boxes1 = [
  {
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: false
  },
  {
    boxType: 'elastic',
    optimalLength: 100,
    isBreakpoint: false,
  },
  {
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: false
  },
  {
    boxType: 'rigid',
    optimalLength: 0,
    isBreakpoint: true,
    preBreakBox: {
      boxType: 'fill'
    }
  },
  {
    boxType: 'rigid',
    optimalLength: 100,
    isBreakpoint: false
  },
  {
    boxType: 'fill',
    isBreakpoint: false
  },
  {
    boxType: 'elastic',
    optimalLength: 50,
    isBreakpoint: false
  },
  {
    boxType: 'rigid',
    optimalLength: 25,
    isBreakpoint: false
  },
  {
    boxType: 'elastic',
    optimalLength: 50,
    isBreakpoint: true
  },
  {
    boxType: 'rigid',
    optimalLength: 200,
    isBreakpoint: false
  },
  {
    boxType: 'fill',
    isBreakpoint: false
  }
];

describe('createLinePackingPathOptimizationProblem', () => {
  const problem = createLinePackingPathOptimizationProblem(boxes1);
});
