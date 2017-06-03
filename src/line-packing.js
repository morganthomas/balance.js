/*

This module solves the problem of "line packing." This is the problem of fitting a finite number
of "boxes" into a finite sequence of lines whose lengths are drawn from a given infinite sequence
of lengths. Prototypical applications are breaking words into lines to form paragraphs, and
breaking lines up across pages.

To specify a line packing problem requires two things: an array of "boxes," and a "line length
function."

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

DEFINITION. A "line packing problem" is an object of the form
  {
    boxes,
    lineLengths
  }

 * boxes is an array of boxes.
 * lineLengths is a function expecting a non-negative integer and producing a number.
   It represents an infinite sequence of lengths, the sequence used to set the line lengths.

A solution to a line packing problem is an array of "line" objects.

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

== solveLinePackingProblem(p, tolerance) ==

Returns a nominally optimal solution to the line packing problem p. Specifically, it returns
an array 'lines' of line objects such that:

1. For some breakpoint list bp, lines.map(l => l.velements) = breakBoxes(p.boxes, bp).
2. For all i, lines[i].length = p.lineLengths(i).
3. The sum of lines[i].badness over all i is (unlikely not to be) minimal, subject to the
   preceding constraints.

In general solveLinePackingProblem needs to consider every breakpoint list bp
(whose indices are less than p.boxes.length), and to look for optimal layout solutions for
each line for every such bp.

In practice we prune the search space by assuming that the best solution will have all lines
possessing badness less than the number tolerance. When a line has badness less than tolerance,
we call that line "feasible." We start by looking for a solution where all lines are feasible.
If none can be found, then we fall back on considering all possible breakpoint lists.

Here is how we begin searching the solution space. We start building a line by taking boxes off
the shelf, adding up their optimal lengths and stopping after taking the first box with
isBreakpoint true such that at that point the sum exceeds the required length of the first line.

We start by considering the following options for the first breakpoint: the index i of the last 
box we took in the preceding paragraph, and the highest index j < i such that boxes[j].isBreakpoint.
By construction, the sum of the optimal lengths of boxes through j is less than the length of
this line.

We look for optimal layouts for the two lines that result from these two breakpoint choices,
i and j. We hope that at least one of them is feasible. If one of the breakpoints makes a
feasible line, then we take whichever of the two lines has the least badness (so necessarily
we are taking a feasible line).

Supposing this procedure succeeds (i.e. produces a feasible line), we continue taking off boxes
in this way to form feasible lines, until we have used all the boxes. If at any point neither
of the two possible line breaks we are considering results in a feasible line, then
we fall back on brute force searching all possible breakpoint lists.

This brute force search can be thought about as searching through a tree of breakpoint lists,
where node/breakpoint list a is below b iff a is an initial segment of b. Since the optimal layout
solution for each line is independent, one can propagate layout solutions for repeated lines
up the tree. One knows that if one excludes the last line resulting from a breakpoint list a,
then the sum of the remaining lines' badnesses is a lower bound on the badness of solutions above a
on the tree. We can therefore prune from the search any node a and all nodes above it if we notice
that this badness figure excluding the last line for that node is greater than the badness of
some solution we are aware of.

*/
