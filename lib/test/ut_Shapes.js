
bs = new BasicShape([[100, 200]], id = 'bs1');
console.assert('BasicShape-bs1: x=100; y=200' === bs.toString());

arc = new Arc(100.563, 200.275, 50, new Angle(0, 5), CW, id = 'arc1');
console.assert('Arc-arc1: x=100.56; y=200.28, radius=50, radians=[0,5]' === arc.toString());
console.assert(150.56 === arc.startX);
console.assert(200.28 === arc.startY);

ccl = new Circle(10.563, 20.275, 20.22, id = 'ccl1');
console.assert('Circle-ccl1: x=10.56; y=20.27, radius=20.22' === ccl.toString());

arc = new Arc(100.563, 200.275, 50, new Angle(0, DVA_PI), id = 'arc2');
console.assert(arc.startX == arc.endX);
console.assert(arc.startY == arc.endY);
console.assert(arc.isCircle);

cclCmb1 = new CircleCombo(20.55, 30.33, 44, [new Angle(0, DVA_PI)], id = 'cclcmb1');
console.assert('CircleCombo-cclcmb1: x=20.55; y=30.33, radius=44' === cclCmb1.toString());

lb1 = new LineBroken([[10, 20], [100, 200], [150, 300]], id = 'lb1');
console.assert('LineBroken-lb1: 10 20;100 200;150 300;' === lb1.toString());



ol1 = new Outline([lb1], id = 'ol1');
console.assert('Outline-ol1: x=NaN; y=NaN: LineBroken-lb1: 10 20;100 200;150 300;,' === ol1.toString());

