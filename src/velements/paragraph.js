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
 * isRigid is a boolean, representing whether this velement needs to be its optimalLength
   or whether its length can vary.
 * isBreakpoint is a boolean, representing whether this velement can be replaced with a line
   break preceded by the box preBreakBox and followed by the box postBreakBox.
 * preBreakBox and postBreakBox are optional parameters which are only meaningful if isBreakpoint
   is true.

"Box" in the context of this file means approximately the same thing as it means in the context
of ./line-packing.js. The difference is that the lengthParameter and optimalLength properties
found in the definition of line-packing.js are here replaced with the optimalWidth property,
because we know that the length used for line packing is always the width.

*/
