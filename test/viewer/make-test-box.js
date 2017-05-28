import { mapScalars } from '../../src/pojo.js';

function makeTestBox(borderColor, objectiveFunction) {
  objectiveFunction = objectiveFunction || {
    domainRepresentative: { width: 0, height: 0 },
    valueAt: () => 0.0,
    gradientAt: () => ({ width: 0, height: 0 })
  };

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
