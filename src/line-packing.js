/*

This module solves the problem of "line packing." This is the problem of fitting a finite number
of "rigid boxes" separated by variable-length "glue" into an initial segment of an infinite
sequence of "lines," each of fixed length. Prototypical applications are breaking words into lines
to form paragraphs, and breaking lines up across pages.

The setup for a line packing problem is a "content list." A content list is an array whose length
is even, where every even-indexed element is a "rigid box," and every odd-indexed element is a
"glue" object.

A "rigid box" is an object of the following form:

  {
    length,
    content
  }

 * 'length' is a positive number.
 * 'content' is a JavaScript object. This module doesn't care what it is. It's there for the
   benefit of the users of the module. Typically this would be a velement.

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

*/
