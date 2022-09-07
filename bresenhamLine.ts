function bresenhamLine(x, y, xx, yy) {
  const canvas = document.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  var oldFill = ctx.fillStyle; // save old fill style ctx.fillStyle = ctx.strokeStyle; // move stroke style to fill xx = Math.floor(xx);
  yy = Math.floor(yy);
  x = Math.floor(x);
  y = Math.floor(y);
  // BRENSENHAM
  var dx = Math.abs(xx - x);
  var sx = x < xx ? 1 : -1;
  var dy = -Math.abs(yy - y);
  var sy = y < yy ? 1 : -1;
  var err = dx + dy;
  var errC; // error value
  var end = false;
  var x1 = x;
  var y1 = y;
  while (!end) {
    ctx.fillRect(x1, y1, 1, 1); // draw each pixel as a rect
    if (x1 === xx && y1 === yy) {
      end = true;
    } else {
      errC = 2 * err;
      if (errC >= dy) {
        err += dy;
        x1 += sx;
      }
      if (errC <= dx) {
        err += dx;
        y1 += sy;
      }
    }
  }
  ctx.fillStyle = oldFill; // restore old fill style
}

bresenhamLine(50, 50, 250, 250);

