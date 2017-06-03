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
   break preceded by preBreakBox and followed by postBreakBox.
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
    badness
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

A "partial solution" to a line packing problem is an object of the following form:

  {
    breakpointList,
    lines,
    badness,
    isTolerable,
    unusedBoxes
  }

 * breakpointList is a breakpoint list.
 * lines is an array of lines, produced by applying breakpointList (with unusedBoxes possibly
   containing the last line of velements from breakBoxes(boxes, breakpointList)).
 * badness is the sum of the badnesses of the lines.
 * isTolerable is a boolean, true iff all lines are tolerable.
 * unusedBoxes is an array of boxes (all the boxes that have yet to be packed into lines
   in this partial solution).

*/
