/*

This module solves the problem of "line packing." This is the problem of fitting a finite number
of "boxes" into a finite sequence of lines whose lengths are drawn from a given infinite sequence
of lengths. Prototypical applications are breaking words into lines to form paragraphs, and
breaking lines up across pages.

To specify a line packing problem requires one thing: an array of "boxes."

DEFINITION. A "box" is an object of the following form:
  {
    velement,
    lengthParameter,
    optimalLength,
    isRigid,
    isBreakpoint,
    [preBreakBox,]
    [postBreakBox]
  }

 * velement is a velement.
 * lengthParameter is a path into velement.layoutProblem.objectiveFunction.domainRepresentative.
   E.g. when line breaking English to make a paragraph, lengthParameter is ['width'].
   When page breaking, lengthParameter is ['height'].
 * optimalLength is a number, presumed to be an optimal setting for lengthParameter.
 * isRigid is a boolean, representing whether this velement needs to be its optimalLength
   or whether its length can vary.
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
    velements,
    layoutSolutions,
    solutionBadnesses,
    length,
    badness,
    postBreakBox
  }

such that:

1. velements is an array of velements.
2. layoutSolutions is an array of PONJOs, the same length as velements, where for all i,
   layoutSolutions[i] is a solution to velements[i].layoutProblem.
3. solutionBadnesses is an array of numbers, the same length as velements, where for all i,
   solutionBadnesses[i] = velements[i].layoutProblem.objectiveFunction(layoutSolutions[i]).
4. length is a number, equal to the sum over all i of
     getAtPath(layoutSolutions[i], boxes[i].lengthParameter).
5. badness = sum of solutionBadnesses.
6. postBreakBox is a box: the box left over from breaking the breakpoint box at the end
   of the line.

DEFINITION. A "breakpoint list" is a list of non-negative integers in ascending order.

== breakBoxes(boxes, breakpoints) ==

Expects 'boxes' to be an array of boxes and 'breakpoints' to be a breakpoint list,
such that breakpoints[i] < boxes.length for all i. Returns an array of arrays of velements,
the elements of the lines that are created by turning boxes[j] into a line break for all
j in breakpoints.

== solveLinePackingProblem(boxes, [settings]) ==

 * boxes is an array of boxes.
 * settings is an optional object configuring the optimization algorithm, with the following
   optional properties:
    * settings.tolerance is a maximum badness for lines. We say that a line is "tolerable"
      iff either this setting is absent or the line's badness is less than settings.tolerance.
      solveLinePackingProblem will not return a solution containing a line with badness
      greater than settings.tolerance, if possible. The attempt to satisfy this requirement
      may trigger an exhaustive search of the space of possible breakpoint lists.
      settings.tolerance is a positive number or Infinity. Supplying settings.tolerance = Infinity
      is equivalent to not supplying settings.tolerance.
    * settings.maxThreads is the maximum number of possible solutions that solveLinePackingProblem
      will concurrently explore (unless it is doing an exhaustive search triggered by an
      inability to find solutions with tolerable lines). Default value is 7. The value must be
      a positive integer or Infinity. If settings.maxThreads = Infinity, then solveLinePackingProblem 
      will do an exhaustive search of the breakpoint list space in every case.

Returns a nominally optimal solution to the given line packing problem. Specifically, it returns
a function which expects a line length function lineLengths and returns an array 'lines' of line 
objects such that:

1. For some breakpoint list bp, lines.map(l => l.velements) = breakBoxes(boxes, bp).
2. For all i, lines[i].length = lineLengths(i).
3. The sum of lines[i].badness over all i is (unlikely not to be) minimal, subject to the
   preceding constraints.

Conceptually, solveLinePackingProblem can be thought of as a curried function. I will
talk about it like that. This currying order allows for easier and more optimized integration
into the rest of the system (or that's the intent). When line packing problems are used
as the basis of velement layout problems, they will need to be called repeatedly in the course
of gradient descent optimization. This should be possible to do reasonably efficiently 
by keeping track, within the closure returned by solveLinePackingProblem, of the most
recently generated solution and various intermediate steps used to generate it. This
record of the last solution can be used as a starting point and adjusted to produce the
next solution, which should be inexpensive when the last input is close in value to the
next input.

Note: The approach described in the preceding paragraph is quite expensive. The approach
in question is to make for example a paragraph element whose layout problem's objective
function computes the badness of the optimal layout of the paragraph according to
solveLinePackingProblem. Computationally, this is analogous to continually recomputing the 
optimal layout of the paragraph as if while resizing the viewport, during the process of
layout optimization. This kind of thing will result in a more interconnected layout optimization
where the layout of the ambient context is sensitive to what is going on inside the paragraph.
This seems expensive in general, and unnecessary for most use cases.

A cheaper approach to paragraph layout is to let a paragraph velement be embedded in
a scroll window where there is unconstrained vertical space; to give that scroll window
a layout problem which lets it compete for space in its ambient context;
and then, in the render function for that scroll window, to solve the line packing
problems for the paragraphs and generally the layout problems for whatever is in the
vertical list that the scroll window displays. In a variant of this approach, the window
does not scroll, but ignores its height property and uses whatever vertical space it needs.

The cheapest approach to paragraph layout is to give a paragraph box velement a layout problem
whose objective function is constantly zero, which solves its own line packing problem
when asked to render itself, using the width it is assigned to set the line lengths,
and ignoring its height property while drawing in whatever vertical space it needs.
This could be appropriate if you want to put a paragraph in some empty space where
you are confident it will never need to scroll, and where nothing will need to be
positioned below it.

If the rest of the layout depends on the height of the paragraph in a way not covered
by the cheaper and cheapest approaches, then you may still be able to get the job done by
telling the paragraph its width in advance of solving the main layout problem,
fixing that as a constant of the layout problem, and letting the paragraph tell you its
height as a function of its width, then fixing that width as a constant of the layout problem.
I don't know if this will really come up or not. If this idea also doesn't work, you can
fall back on entangling the paragraph layout problem with the ambient layout problem,
as described at the start of this Note. End Note.

In general solveLinePackingProblem needs to consider every breakpoint list bp
(whose indices are less than boxes.length), and to look for optimal layout solutions for
each line for every such bp. That's a lot of work, though, and the algorithm uses
heuristics to prune the search space.

DEFINITION. A "partial solution" to a line packing problem is an object of the following form:

  {
    breakpointList,
    lines,
    badness,
    isTolerable,
    unusedBoxes,
    postBreakBox,
    isDead
  }

 * breakpointList is a breakpoint list.
 * lines is an array of lines, produced by applying breakpointList (with unusedBoxes possibly
   containing the last array of velements from breakBoxes(boxes, breakpointList)).
 * badness is the sum of the badnesses of the lines.
 * isTolerable is a boolean, true iff all lines are tolerable.
 * unusedBoxes is an array of boxes (all the boxes that have yet to be packed into lines
   in this partial solution). When unusedBoxes.length = 0, we call this partial solution "complete."
 * postBreakBox is any postBreakBox left over from the line break of the final line.
 * isDead is a boolean, indicating whether this partial solution is greyed out as the root of
   a non-viable part of the solution tree, meaning that any way of extending this partial
   solution has been deemed non-viable by the algorithm.

During problem-solving, the algorithm maintains a list of 'threads' or partial solutions.
Initially, this list contains one partial solution, with an empty breakpoint list,
an empty array of lines, and unusedBoxes = boxes. The algorithm alternates between two basic steps:
Multiply, and Prune. During Multiply, the number of threads increases. During Prune, threads are
removed and marked as dead. There are also various administrative steps in the algorithm, such as
checking whether the conditions for termination hold.

The behavior of Multiply depends on an internal flag of the algorithm, isExhaustive. By default,
isExhaustive = false. If settings.maxThreads = Infinity, then isExhaustive = true. Additionally,
if the algorithm's non-exhaustive search finds no solutions where all lines are tolerable,
it will set isExhaustive = true; but that step in the algorithm has yet to be described.

If isExhaustive = true, Multiply will add to the solution space all results b of extending one
non-dead thread a to a partial solution b such that a.breakpointList is an initial segment of
b.breakpointList, a.lines is an initial segment of b.lines, and b.lines.length = a.lines.length + 1.
Call b a "one-step extension" of a.

If isExhaustive = true, Multiply will also add to the solution space all partial solutions b
with b.breakpointList.length = 1 such that b is not an initial segment of any thread (in the sense
described in the previous paragraph).

If isExhaustive = false, then for each non-dead non-complete thread a, Multiply will add
to the solution space up to two partial solutions b and c which are one-step extensions of a,
such that:

 * i is the new element of b.breakpointList. i is the least number such that the sum of
   the optimalWidths of the boxes used to produce the new line in b is greater than or equal to 
   the target length of the new line and such that isBreakpoint is true of the box that falls at
   the end of the new line according to b.breakpointList. If these conditions on i are
   unsatisfiable, then let i = boxes.length (representing a break after the end of the box
   list, so that all the remaining unused boxes are packed into a line).
 * j is the new element of c.breakpointList. j is the greatest number such that j < i
   and isBreakpoint is true of the box that falls at the end of the new line according to
   b.breakpointList. Consequent of the definition, the sum of the optimalWidths of the boxes
   used to produce the new line in c is less than the target length of the new line.

Such b will exist. Such c may not exist. For example, such a b may exist without such a c existing if
the first box unused in a with isBreakpoint true is the box at the end of the new line of b.

Prune will remove from the solution space all threads which are an initial segment of some other
thread(s) in the solution space.

If isExhaustive = false, then Prune will mark as dead all non-dead threads containing an intolerable
line.

If isExhaustive = false and the non-dead thread count is greater than settings.maxThreads, then
Prune will mark as dead the most bad threads to bring the count of non-dead threads down to
settings.maxThreads.

After Prune and before the next Multiply, we check to see if we need, on the one hand,
to terminate the algorithm, or, on the other hand, to switch from a non-exhaustive search to
an exhaustive search.

If isExhaustive = false, all non-dead threads are complete, and there is at least one non-dead 
thread, then we terminate the algorithm and return the least bad thread as the solution.

If isExhaustive = false and there are no non-dead threads, then we switch isExhaustive to true
and mark all threads as non-dead. (Henceforth the algorithm should not mark any thread as dead.)

If isExhaustive = true and all threads are complete, then we terminate the algorithm and return
the least bad thread as the solution.

In all other cases, we continue on without doing anything in this administrative step.
Some condititions not covered should never arise: for example, it should never
occur that isExhaustive = true and there are no non-dead threads.

We map a complete partial solution to a complete solution, a return value of the algorithm,
by simply dropping the following properties:
 * unusedBoxes, which is necessarily [].
 * isDead, which is necessarily false.

DEFINITION. A "solution" to a line packing problem is an object of the following form:
  {
    breakpointList,
    lines,
    badness,
    isTolerable,
    postBreakBox
  }

See the definition of "partial solution" for the explanations of these properties.

The remaining functions in this file are intermediate steps that solveLinePackingProblem
needs to take.

== createLine(boxes, length) ==

Expects an array of boxes and a positive number. Returns a corresponding line, of the given
length, whose velements are the velements of the boxes. The layoutSolutions are chosen to
minimize badness. If the last box is breakable, then it will be destroyed; any postBreakBox
will be returned as a property of the returned line; and any preBreakBox will be inserted at
the end of the line.

*/

import { 
  sumDifferentiableScalarFields,
  expandDomainOfDifferentiableScalarField 
} from './compose-differentiable-scalar-fields.js';
import { makeSoftConstraintField } from './scalar-fields/soft-constraint-field.js';
import { solveOptimizationProblem } from './optimization-problem.js';
import { constrainOptimizationProblem } from './constrain-optimization-problem.js';

function solveLinePackingProblem(boxes, settings) {
  settings = settings || {};
  let maxThreads = settings.maxThreads || 7;
  let tolerance = settings.tolerance || Infinity;

  return function(lineLengths) {
    let liveThreads = [
      {
        breakpointList: [],
        lines: [],
        badness: 0,
        isTolerable: true,
        unusedBoxes: boxes,
        postBreakBox: undefined,
        isDead: false
      }
    ];

    let deadThreads = [];
    let isExhaustive = //maxThreads === Infinity;
        true; // TODO: implement non-exhaustive search

    while (true) {
      // combine Multiply and Prune by building a list of extended threads and
      // replacing the liveThreads with it.
      if (isExhaustive) {
        let extendedThreads = [];

        liveThreads.forEach(thread => {
          if (thread.unusedBoxes.length === 0) {
            extendedThreads.push(thread);
          } else {
            // extend this thread in all possible ways
            let minNextBreakpointIndex = thread.breakpointList.length === 0 ?
                0 :
                1 + thread.breakpointList[thread.breakpointList.length-1];
            for (let i = 0; i < thread.unusedBoxes.length; i++) {
              let nextBreakpointIndex = minNextBreakpointIndex+i;
              if (!boxes[nextBreakpointIndex].isBreakpoint && i+1 !== thread.unusedBoxes.length) {
                continue;
              }
              let newThread = addLineToThread(boxes, lineLengths, tolerance, thread, nextBreakpointIndex);
              extendedThreads.push(newThread);
            }
          }
        });

        liveThreads = extendedThreads;
      } else {
        let extendedThreads = [];

        liveThreads.forEach(thread => {
          if (thread.unusedBoxes.length === 0) {
            extendedThreads.push(thread);
          } else {
            
          }
        });
      }

      // check for stopping condition and maybe return
      let allAreComplete = liveThreads.every(thread => thread.unusedBoxes.length === 0);
      if (allAreComplete) {
        let minBadness = Infinity;
        let bestOne = null;
        liveThreads.forEach(thread => {
          if (thread.badness < minBadness) {
            bestOne = thread;
            minBadness = thread.badness;
          }
        });
        return {
          breakpointList: bestOne.breakpointList,
          lines: bestOne.lines,
          badness: bestOne.badness,
          isTolerable: bestOne.isTolerable,
          postBreakBox: bestOne.postBreakBox
        };
      }

      // TODO: check if we need to switch to exhaustive search
    }
  };
}

function addLineToThread(boxes, lineLengths, tolerance, thread, nextBreakpointIndex) {
  let minNextBreakpointIndex = thread.breakpointList.length === 0 ?
      0 :
      1 + thread.breakpointList[thread.breakpointList.length-1];
  let nextLineBoxes = boxes.slice(minNextBreakpointIndex, nextBreakpointIndex+1);
  let nextLineLength = lineLengths(thread.lines.length);
  let nextLine = createLine(nextLineBoxes, nextLineLength);
  let lines = thread.lines.concat([nextLine]);
  let badness = lines.map(line => line.badness).reduce((a,b)=>a+b, 0);
  let isTolerable = badness < tolerance;
  let unusedBoxes = thread.unusedBoxes.slice(nextLineBoxes.length);
  let postBreakBox = nextLine.postBreakBox;
  let newThread = {
    breakpointList: thread.breakpointList.concat([nextBreakpointIndex]),
    lines,
    badness,
    isTolerable,
    unusedBoxes,
    postBreakBox,
    isDead: false
  };
  return newThread;
}

function createLine(boxes, length) {
  let lastBox = boxes[boxes.length - 1];
  let postBreakBox = lastBox.isBreakpoint ? lastBox.postBreakBox : undefined;
  let boxes2 = lastBox.isBreakpoint ?
      boxes.map((box,i) => i === boxes.length - 1 ?
                lastBox.preBreakBox :
                box).filter(box => box !== undefined) :
      boxes;
  let velements = boxes2.map(box => box.velement);

  // start building the optimization problem to find the layoutSolutions
  let domainRepresentative = velements.map(
    el => el.layoutProblem.objectiveFunction.domainRepresentative);
  let totalLengthConstraint = 
      makeSoftConstraintField(
        domainRepresentative,
        boxes2.map((box,i) => [1,[i].concat(box.lengthParameter),0]),
        undefined,
        -length);

  let objectiveFunction = sumDifferentiableScalarFields(
    totalLengthConstraint, 
    ...velements.map(
      (el,i) => expandDomainOfDifferentiableScalarField(
        el.layoutProblem.objectiveFunction,
        domainRepresentative,
        [i]))
  );

  function initialGuessFunction(constraints) {
    return constraints.map((c,i) => velements[i].layoutProblem.initialGuessFunction(c));
  }

  let optimizationProblem = {
    objectiveFunction,
    initialGuessFunction
  };

  let constraints = boxes2.map(
    (box,i) => 
      box.isRigid ?
      [[i,...box.lengthParameter],box.optimalLength] :
      null)
      .filter(c => c !== null);

  let constrainedOptimizationProblem = constrainOptimizationProblem(optimizationProblem, constraints);

  let solution = solveOptimizationProblem(constrainedOptimizationProblem);
  let badness = constrainedOptimizationProblem.objectiveFunction.valueAt(solution);
  let layoutSolutions = constrainedOptimizationProblem.unconstrainPONuNJO(solution);

  let solutionBadnesses = layoutSolutions.map((sol, i) => velements[i].layoutProblem.objectiveFunction.valueAt(sol));

  return {
    velements,
    layoutSolutions,
    solutionBadnesses,
    length,
    badness,
    postBreakBox
  };
}

export { solveLinePackingProblem, createLine }
