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
