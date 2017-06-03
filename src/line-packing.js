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

== solveLinePackingProblem(boxes, tolerance) ==

 * boxes is an array of boxes.
 * tolerance is a number.

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
each line for every such bp.

In practice we prune the search space by assuming that the best solution will have all lines
possessing badness less than the number tolerance. When a line has badness less than tolerance,
we call that line "tolerable." We start by looking for a solution where all lines are tolerable.
If none can be found, then we fall back on considering all possible breakpoint lists.

Here is how we begin searching the solution space. We start building a line by taking boxes off
the shelf, adding up their optimal lengths and stopping after taking the first box with
isBreakpoint true such that at that point the sum exceeds the required length of the first line.

We start by considering the following options for the first breakpoint: the index i of the last 
box we took in the preceding paragraph, and the highest index j < i such that boxes[j].isBreakpoint.
By construction, the sum of the optimal lengths of boxes through j is less than the length of
this line.

We look for optimal layouts for the two lines that result from these two breakpoint choices,
i and j. We hope that at least one of them is tolerable. If one of the breakpoints makes a
tolerable line, then we take whichever of the two lines has the least badness (so necessarily
we are taking a tolerable line).

Supposing this procedure succeeds (i.e. produces a tolerable line), we continue taking off boxes
in this way to form tolerable lines, until we have used all the boxes. If at any point neither
of the two possible line breaks we are considering results in a tolerable line, then
we fall back on brute force searching all possible breakpoint lists.

This brute force search can be thought about as searching through a tree of breakpoint lists,
where node/breakpoint list a is below b iff a is an initial segment of b. Since the optimal layout
solution for each line is independent, one can propagate layout solutions for repeated lines
up the tree. One knows that if one excludes the last line resulting from a breakpoint list a,
then the sum of the remaining lines' badnesses is a lower bound on the badness of solutions above a
on the tree. We can therefore prune from the search any node a and all nodes above it if we notice
that this badness figure excluding the last line for that node is greater than the badness of
some solution we are aware of.

SECTION: Algorithm, next attempt

The algorithm just sketched may be easier to think about/implement not in terms of a tree of
breakpoint lists, but in terms of a tree of "partial solutions." A "partial solution" to a line
packing problem is an object of the following form:

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

Given two partial solutions to the same problem a and b, a is below b in the tree iff a.lines
is an initial segment of b.lines.

A partial solution s is "complete" iff s.unusedBoxes.length == 0.

The main step in the algorithm is to build as much of the tree as we need to find a
complete solution with minimal badness.

We start by adding the empty partial solution to the tree, which has an empty breakpoint list,
an empty list of lines, badness 0, and unusedBoxes = boxes.

We iterate the following step until there is at least one complete solution in the tree
or the tree has no leaves whose lines are all tolerable. We look at all leaves in the tree 
whose lines are all tolerable. For each one, we look at the two most plausible ways of building
the next line, and add the corresponding tree elements. 

Suppose at the end of this process the tree contains a complete leaf with tolerable lines. Then we
return the least bad leaf with tolerable lines.

Suppose, on the other hand, that we end up with no complete leaves with tolerable lines. Then
we set about doing an exhaustive search of the tree, pruning the branches rooted at any
partial solution whose badness is greater than the badness of some complete solution.

*/
