/*

This module solves the problem of "line packing." This is the problem of fitting a finite number
of "rigid boxes" separated by variable-length "glue" into an initial segment of an infinite
sequence of "lines," each of fixed length. Prototypical applications are breaking words into lines
to form paragraphs, and breaking lines up across pages.

The line packing problem requires two things as input: a "content list," and a "line length function."

DEF:
A "content list" is an array whose length is even, where every even-indexed element is a "rigid box,"
and every odd-indexed element is a "glue" object.

DEF:
A "line length function" is a function which expects as input a non-negative integer, and produces
as output a non-negative number. It represents an infinite sequence of line lengths.

DEF:
A "rigid box" is an object of the following form:

  {
    length,
    content
  }

 * 'length' is a positive number.
 * 'content' is a JavaScript object. This module doesn't care what it is. It's there for the
   benefit of the users of the module. Typically this would be a velement.

DEF:
A "glue" object is an object of the following form:

  {
    optimalLength,
    stretchiness,
    breakPenalty,
    overfillSensitivity,
    underfillSensitivity,
    preBreakInsertion,
    postBreakInsertion
  }

 * optimalLength is a positive number, representing the length which this glue would most like to be.
 * stretchiness is a non-negative number, which is used as a coefficient scaling the badness caused
   by deviation of the glue's actual length from its optimalLength.
 * breakPenalty is a number, which is added to the badness of a solution for which this glue
   is a line break (more on this later).
 * overfillSensitivity is a number, which is used as a coefficient scaling the badness caused by
   overfilling a line for which this glue is a line break.
 * underfillSensitivity is a number, which is used as a coefficient scaling the badness caused by
   underfilling a line for which this glue is a line break.
 * preBreakInsertion is a content list, inserted at the end of any line for which this glue is a 
   line break.
 * postBreakInsertion is a content list, inserted at the beginning of any subsequent line directly 
   after any line for which this glue is a line break.

DEF:
The final output of the line packing algorithm is an array of "line" objects. A "line" is an
object of the following form:

  {
    contents,
    length,
    badness,
    glueLengths,
    glueBadnesses
  }

 * 'contents' is a content list (what is in the line).
 * 'length' is a non-negative number (the length of the line).
 * 'badness' is a number (the badness of the line).
 * glueLengths is an array of numbers of length contents.length / 2 (the lengths of each glue object).
 * glueBadnesses is an array of numbers of length contents.length / 2 (the badnesses of each glue object).

Lines satisfy the following conditions:

 1. length = sum of glueLengths + the lengths of the rigid boxes in contents.
 2. badness = sum of glueBadnesses.
 3. For all 0 <= i < (contents.length / 2) - 1:
     glueBadnesses[i] =
 4. For i = (contents.length / 2) - 1:
     glueBadnessis[i] =
 5. badness is minimized subject to the preceding constraints.

== solveLinePackingProblem(contentList, lineLengthFunction) ==

Expects contentList to be a content list, and lineLengthFunction to be a line length function.
Produces as output an array of line objects 'lines,' each satisfying:

1. For all 0 <= i < lines.length, contentList.length === lineLengthFunction(i).
2. Merging the contents of the lines gives you contentList.
3. The sum of the badness of the lines is minimized subject to the preceding constraints.

== createLine(contentList, length) ==

Returns a line object with contents = contentList and length = length.

*/
