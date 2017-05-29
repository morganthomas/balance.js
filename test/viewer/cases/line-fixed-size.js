import { makeTrivialOptimizationProblem } from '../../../src/optimization-problem.js';

export default {
  layoutProblem: makeTrivialOptimizationProblem({ width: 0, height: 0 }),

  render: () => (
    { stroke: { 
      start: { x: 0, y: 0 },
      motions: [{ lineTo: { x: 100, y: 100 } }],
      color: { r: 0, g: 1, b: 0 },
      width: 2,
      lineCap: 'butt'
    } } )
};
