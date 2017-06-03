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

== solveLinePackingProblem(p) ==

Returns a nominally optimal solution to the line packing problem p. Specifically, it returns
an array 'lines' of line objects such that:

1. For some breakpoint list bp, lines.map(l => l.velements) = breakBoxes(p.boxes, bp).
2. For all i, lines[i].length = p.lineLengths(i).
3. The sum of lines[i].badness over all i is (unlikely not to be) minimal, subject to the
   preceding constraints.

*/