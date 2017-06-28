/*

This is a low level module for creating English style left to right, top to bottom paragraphs.
In time it should be generalized to other use cases.

== makeParagraph(boxes) ==

Expects as input an array of "box" objects, and produces as output a velement.

DEFINITION. A "box" is an object of the following form:
  {
    velement,
    optimalWidth,
    isRigid,
    isBreakpoint,
    [preBreakBox,]
    [postBreakBox]
  }

 * velement is a box velement.
 * optimalWidth is a number, presumed to be an optimal setting for this box's width.
 * isRigid is a boolean, representing whether this velement needs to be its optimalWidth
   or whether its width can vary.
 * isBreakpoint is a boolean, representing whether this velement can be replaced with a line
   break preceded by the box preBreakBox and followed by the box postBreakBox.
 * preBreakBox and postBreakBox are optional parameters which are only meaningful if isBreakpoint
   is true.

"Box" in the context of this file means approximately the same thing as it means in the context
of ./line-packing.js. The difference is that the lengthParameter and optimalLength properties
found in the definition in line-packing.js are here replaced with the optimalWidth property,
because we know that the length used for line packing is always the width.

The velement that is returned has a trivial objective function which is always zero. Its
initial guess function will give you a height if you give it a width constraint, but it will
choke if you don't give it a width constraint. The render function will ignore the height it is
given and use as much vertical space as it needs, but it will respect the width it
is given.

All velements on a given line are constrained to have the same height. On that basis the height
of each line is optimized individually.

See ./line-packing.js for more commentary on the line breaking algorithm and how the inputs
are interpreted.

*/

import { solveLinePackingProblem } from '../line-packing.js';
import { makeConstantScalarField } from '../differentiable-scalar-field.js';

function makeParagraph(boxes) {
  let solve = solveLinePackingProblem(boxes.map(box => Object.assign({}, box, {
    lengthParameter: ['width'],
    optimalLength: box.optimalWidth
  })));

  let layoutProblem = {
    objectiveFunction: makeConstantScalarField({ width: 0, height: 0 }, 0),
    initialGuessFunction(constraints) {
      // TODO: implement properly
      return { width: constraints.width || 0, height: constraints.height || 0 }
    }
  };

  function render(solution) {
    let width = solution.width;
    let lines = solve(() => width).lines;
    console.log(lines);
    let heightUsed = 0;
    return lines.map((line,i) => {
      let widthUsed = 0;
      let result = {
        translate: {
          what: line.velements.map((el,i) => {
            let result = {
              translate: {
                what: el.render(line.layoutSolutions[i]),
                by: { y: 0, x: widthUsed }
              }
            };
            widthUsed += line.layoutSolutions[i].width;
            return result;
          }),
          by: { x: 0, y: heightUsed }
        }
      };
      heightUsed += Math.max(...line.layoutSolutions.map(sol => sol.height));
      console.log('heightUsed', heightUsed);
      return result;
    });
  }

  return {
    layoutProblem,
    render
  };
}

export { makeParagraph }
