import { mapScalars } from '../../src/pojo.js';

function makeTestBox(objectiveFunction, borderColor) {
  return {
    layoutProblem: {
      objectiveFunction,
      initialGuessFunction: (c) => mapScalars(x => x || 0, c)
    },

    render(sln) {
      let w = sln.width;
      let h = sln.height;
      return {
        stroke: {
          start: { x: 1, y: 1 },
          motions: [
            { lineTo: { x: w - 1, y: 1 } },
            { lineTo: { x: w - 1, y: h - 1 } },
            { lineTo: { x: 1, y: h - 1 } },
            { lineTo: { x: 1, y: 1 } }
          ],
          color: borderColor,
          width: 2,
          lineCap: 'square'
        }
      };
    }
  };
}

export { makeTestBox }
