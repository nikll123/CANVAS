
let bs = new BasicShape([[100, 200]], id = 'bs1');
console.assert('bs1:x=100,y=200' === bs.toString());

let arc1 = new Arc(100.563, 200.275, 50, new Angle(0, 5), CW, id = 'arc1');
console.assert('arc1:x=100.56,y=200.28,radius=50,radians=[0,5]' === arc1.toString());
console.assert(150.56 === arc1.startX);
console.assert(200.28 === arc1.startY);

let ccl = new Circle(10.563, 20.275, 20.22, id = 'ccl1');
console.assert('ccl1:x=10.56,y=20.27,radius=20.22' === ccl.toString());

let arc2 = new Arc(100.563, 200.275, 50, new Angle(0, DVA_PI), id = 'arc2');
console.assert(arc2.startX == arc2.endX);
console.assert(arc2.startY == arc2.endY);
console.assert(arc2.isCircle);

let cclCmb1 = new CircleCombo(20.55, 30.33, 44, [new Angle(0, DVA_PI)], id = 'cclcmb1');
console.assert('cclcmb1:x=20.55,y=30.33,radius=44' === cclCmb1.toString());

let lb1 = new LineBroken([[10, 20], [100, 200], [150, 300]], id = 'lb1');
console.assert('lb1:x=10,y=20:p0:x=10,y=20;p1:x=100,y=200;p2:x=150,y=300;' === lb1.toString());


let ol1 = new Outline([lb1], id = 'ol1');
console.assert('ol1:: lb1:x=10,y=20:p0:x=10,y=20;p1:x=100,y=200;p2:x=150,y=300;,' === ol1.toString());

