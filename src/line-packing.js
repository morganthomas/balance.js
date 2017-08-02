/*

This module solves the problem of "line packing." This is the problem of fitting a finite number
of "boxes" into a finite sequence of lines whose lengths are drawn from a given infinite sequence
of lengths. Prototypical applications are breaking words into lines to form paragraphs, and
breaking lines up across pages.

To specify a line packing problem requires one thing: an array of "boxes."

DEFINITION. A "box" is an object with the following data (and it can have additional properties too):
  {
    boxType,
    optimalLength,
    isBreakpoint,
    [preBreakBox,]
    [postBreakBox]
  }

 * boxType is one of 'rigid', 'fill', or 'elastic'. Rigid boxes must be exactly their
   optimalLength. Elastic boxes can vary from their optimalLength with a penalty. Fill boxes
   can be any length, and they ignore their optimalLength.
 * optimalLength is a number, presumed to be an optimal length for this box.
 * isBreakpoint is a boolean, representing whether this velement can be replaced with a line
   break preceded by the box preBreakBox and followed by the box postBreakBox.
 * preBreakBox and postBreakBox are optional parameters which are only meaningful if isBreakpoint
   is true.

DEFINITION. A "line length function" is a function which expects as input a non-negative integer,
and produces as output a non-negative number. It represents an infinite sequence of line lengths.

A solution to a line packing problem is a function which takes a line length function and returns 
an array of "line" objects.

DEFINITION. A "line" is an object of the following form:
  {
    boxes,
    length,
    elasticBoxStretchShrinkRatio,
    badness,
    postBreakBox
  }

such that:

1. boxes is an array of boxes.
2. length is a number.
3. elasticBoxStretchShrinkRatio is a number greater than 0.
3. badness is a number (the badness of the line).
4. postBreakBox is a box: the box left over from breaking the breakpoint box at the end
   of the line.

DEFINITION. A "breakpoint list" is an array of non-negative integers in ascending order.

== breakBoxes(boxes, breakpoints) ==

Expects 'boxes' to be an array of boxes and 'breakpoints' to be a breakpoint list,
such that breakpoints[i] < boxes.length for all i. Returns an array of arrays of boxes,
the elements of the lines that are created by turning boxes[j] into a line break for all
j in breakpoints.

== solveLinePackingProblem(boxes, [settings]) ==

 * boxes is an array of boxes.
 * settings is an optional object configuring the optimization algorithm, with the following
   optional properties:
    * elasticBadnessCoefficient is the coefficient used in computing the badness resulting
      from stretching or shrinking an elastic box. It has a default (TODO: where?)
    * lineMisfillBadnessCoefficient is the coefficient used in computing the badness resulting
      from underfilling or overfilling a line. It has a default (TODO: where?)
    * settings.tolerance is a maximum badness for lines. We say that a line is "tolerable"
      iff either this setting is absent or the line's badness is less than settings.tolerance.
      solveLinePackingProblem will not return a solution containing a line with badness
      greater than settings.tolerance, if possible. The attempt to satisfy this requirement
      may trigger an exhaustive search of the space of possible breakpoint lists (TODO: not true).
      settings.tolerance is a positive number or Infinity. Supplying settings.tolerance = Infinity
      is equivalent to not supplying settings.tolerance.
    * settings.maxThreads is the maximum number of possible solutions that solveLinePackingProblem
      will concurrently explore (unless it is doing an exhaustive search triggered by an
      inability to find solutions with tolerable lines). Default value is 7. The value must be
      a positive integer or Infinity. If settings.maxThreads = Infinity, then solveLinePackingProblem 
      will do an exhaustive search of the breakpoint list space in every case.

solveLinePackingProblem returns a function which expects as input a line length function
and produces as output a solution. TODO: what properties does the solution satisfy?

DEFINITION. A "solution" to a line packing problem is an object of the following form:
  {
    breakpointList,
    lines,
    badness,
    isTolerable,
    postBreakBox
  }

See the definition of "partial solution," below, for the explanations of these properties.

DEFINITION. A "partial solution" to a line packing problem is an object of the following form:

  {
    breakpointList,
    lines,
    lineBadnesses,
    badness,
    isTolerable,
    unusedBoxes,
    postBreakBox
  }

 * breakpointList is a breakpoint list.
 * lines is an array of lines, produced by applying breakpointList (with unusedBoxes possibly
   containing the last array of velements from breakBoxes(boxes, breakpointList)).
 * lineBadnesses is an array of numbers, of the same length as lines, giving the badness of
   each line.
 * badness is the sum of the badnesses of the lines.
 * isTolerable is a boolean, true iff all lines are tolerable.
 * unusedBoxes is an array of boxes (all the boxes that have yet to be packed into lines
   in this partial solution). When unusedBoxes.length = 0, we call this partial solution "complete."
 * postBreakBox is any postBreakBox left over from the line break of the final line.

The line packing algorithm uses path optimization, where the paths are partial solutions.
See ./path-optimization.js. The path optimization problem is created by the function
createLinePackingPathOptimizationProblem.

The remaining functions in this file are intermediate steps that solveLinePackingProblem
needs to take.

== createLinePackingPathOptimizationProblem(boxes, [settings]) ==

Creates the path optimization problem configuration object used in the implementation
of solveLinePackingProblem, and passed internally to solvePathOptimizationProblem.

== createLine(boxes, length) ==

Expects an array of boxes and a positive number. Returns a corresponding line, of the given
length. 

*/

import assert from 'assert';

function breakBoxes(boxes1, breakpoints) {
  let lines = [];

  let breakpointIndex = 0;
  let nextLine = [];

  for (let i = 0; i < boxes1.length; i++) {
    if (breakpointIndex < breakpoints.length) {
      let breakpoint = breakpoints[breakpointIndex];
      if (breakpoint === i) {
        let box = boxes1[i];
        assert(box.isBreakpoint);
        if (box.preBreakBox) {
          nextLine.push(box.preBreakBox);
        }
        lines.push(nextLine);
        nextLine = [];
        if (box.postBreakBox) {
          nextLine.push(box.postBreakBox);
        }
        breakpointIndex++;
      } else {
        assert(i < breakpoint);
        nextLine.push(boxes1[i]);
      }
    } else {
      nextLine.push(boxes1[i]);
    }
  }

  if (nextLine.length > 0) {
    lines.push(nextLine);
  }

  return lines;
}

export {
  breakBoxes
}
