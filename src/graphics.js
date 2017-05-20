/*

This file describes a medium-independent, POJO-based vector graphics representation.
Graphics objects can take the following forms:

 * { stroke: { start: { x, y }, motions, color: { r, g, b }, width, lineCap } }
 * { translate: { what, by: { x, y } } }
 * Any array of graphics objects is a graphics object.

In these forms:

 * x, y, width are numbers in arbitrary coordinate space units, which should be CSS pixels
   in the initial coordinate space but could be modified by transformations.
   In the initial coordinate space, { x: 0, y: 0 } should be the top left corner
   of the viewport; increasing x should move towards the right; and increasing y should move
   towards the bottom.
 * lineCap is one of 'butt', 'round', or 'square'.
 * r, g, b are numbers between 0 and 1.
 * 'what' is a graphics object.
 * 'motions' is an array of motion objects.

Motion objects can take the following forms:

 * { lineTo: { x, y } }

== drawToCanvas(canvas, graphics) ==

Takes an HTML canvas element and a graphics object, and draws the given graphics object
to the given canvas.

*/

function drawToCanvas(canvas, graphics) {
  var ctx = canvas.getContext('2d');
  if (graphics.stroke) {
    let stroke = graphics.stroke;
    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = 'rgb(' + stroke.color.r + ', ' + stroke.color.g + ', ' + stroke.color.b + ', '+ stroke.color.a + ')';
    ctx.lineCap = stroke.lineCap;
    ctx.beginPath();
    ctx.moveTo(stroke.start.x, stroke.start.y);
    stroke.motions.forEach(function(motion) {
      if (motion.lineTo) {
        ctx.lineTo(motion.lineTo.x, motion.lineTo.y);
      }
    });
    ctx.stroke();
  }
}
