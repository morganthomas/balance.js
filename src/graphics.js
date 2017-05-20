/*

This file describes a medium-independent, POJO-based vector graphics representation.
Graphics objects can take the following forms:

 * { line: { from: { x, y }, to: { x, y }, color: { r, g, b } } }
 * { translate: { what, by: { x, y } } }
 * Any array of graphics objects is a graphics object.

In these forms:

 * x and y are numbers in arbitrary coordinate space units, which should be CSS pixels
   in the initial coordinate space but could be modified by transformations.
   In the initial coordinate space, { x: 0, y: 0 } should be the bottom left corner
   of the viewport; increasing x should move towards the right; and increasing y should move
   towards the top.
 * r, g, b are numbers between 0 and 1.
 * 'what' is a graphics object.

== drawToCanvas(canvas, graphics) ==

Takes an HTML canvas element and a graphics object, and draws the given graphics object
to the given canvas.

*/
