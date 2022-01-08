function init() {
  ctx = document.getElementById('canvas').getContext('2d');
  center = 250;


  window.requestAnimationFrame(draw);

}

function getRndAngle()
{
  // v = Math.random() * 3 * Math.PI / 2;
  ts = new Date(Date.now());
  mseconds = ts.getMilliseconds();
  seconds = ts.getSeconds() + mseconds / 1000;
  
  v = Math.sin(seconds);
  return v;
}

function drawHand()
{
  ctx.save();
  angle = getRndAngle();
  greenHand = new Path2D();
  greenHand.moveTo(-10, 45);
  greenHand.lineTo(-2, -180);
  greenHand.lineTo(2, -180);
  greenHand.lineTo(10, 45);
  greenHand.closePath();
  greenHand1 = new Path2D();
  greenHand1.arc(0, 0, 30, 0, 2 * Math.PI);
  greenHand.addPath(greenHand1);

  ctx.fillStyle = '#88FF88';
  ctx.translate(center, center);
  ctx.rotate(angle);
  ctx.fill(greenHand);

  ctx.restore();
}

function draw() {

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 500, 500);
  // regular scale parameters
  angle_start = 3 * Math.PI / 4;
  angle_end = 9 * Math.PI / 4;
  strokeStyle1 = '#808000';
  strokeStyle2 = '#c0c000';
  count_items = 30;
  line_width = 20;
  radius = 180
  let degree_per_items = Array(count_items).fill(2);
  regularscale(ctx, center, radius, angle_start, angle_end, strokeStyle1, strokeStyle2, line_width, count_items, true);

  strokeStyle1 = '#008080';
  strokeStyle2 = '#00c0c0';
  degree_per_items = [3, 2, 5, 4, 6, 3, 1, 6];
  line_width = 20;
  radius = 200
  scale(ctx, center, radius, angle_start, angle_end, strokeStyle1, strokeStyle2, line_width, degree_per_items, true);

  drawHand();
  window.requestAnimationFrame(draw);

  // strokeStyle1 = '#000000';
  // strokeStyle2 = '#c000c0';
  // degree_per_items = [29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1];
  // line_width = 20;
  // radius = 220
  // angle_start = 0;
  // angle_end = 2 * Math.PI;
  // scale(ctx, center, radius, angle_start, angle_end, strokeStyle1, strokeStyle2, line_width, degree_per_items, false);

}


function regularscale(ctx, center, radius, angle_start, angle_end, strokeStyle1, strokeStyle2, line_width, count_items, showText) {
  let degree_per_items = Array(count_items).fill(1);
  scale(ctx, center, radius, angle_start, angle_end, strokeStyle1, strokeStyle2, line_width, degree_per_items, showText)
}

function scale(ctx, center, radius, angle_start, angle_end, strokeStyle1, strokeStyle2, line_width, dpi, showText) {
  let count_items = 0;
  for (let x of dpi) {
    count_items += x;
  }
  ctx.lineWidth = line_width;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = "16px serif";
  ctx.textBaseline = "middle";
  let angle_item = (angle_end - angle_start) / count_items;
  angle1 = angle_start;
  ctx.strokeStyle = strokeStyle1;
  for (i = 0; i < dpi.length; i++) {
    k = dpi[i];
    angle2 = angle1 + k * angle_item;
    ctx.beginPath();
    ctx.arc(center, center, radius, angle1, angle2);
    ctx.stroke();
    if (showText) {
      angle_mid = (angle1 + angle2) / 2;
      x1 = center + Math.cos(angle_mid) * radius;
      y1 = center + Math.sin(angle_mid) * radius;
      text = (i + 1).toString();
      textMetrics = ctx.measureText(text);
      x1 = x1 - textMetrics.width / 2;
      ctx.fillText(text, x1, y1);
    }

    angle1 = angle2;
    if (ctx.strokeStyle == strokeStyle1)
      ctx.strokeStyle = strokeStyle2;
    else
      ctx.strokeStyle = strokeStyle1;

  }
}
