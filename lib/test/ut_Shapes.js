
bs = new BasicShape([[100, 200]]);
console.assert('BasicShape: x=100; y=200' === bs.toString());

arc = new Arc(100.563, 200.275, 50, new Angle(0, 5));
console.assert('Arc: x=100.56; y=200.28, radius=50, radians=[0,5]' === arc.toString());
console.assert(150.56 === arc.startX);
console.assert(200.28 === arc.startY);

arc = new Arc(100.563, 200.275, 50, new Angle(0, DVA_PI));

console.assert(arc.startX == arc.endX);
console.assert(arc.startY == arc.endY);
console.assert(arc.isCircle);
