
bs = new BasicShape([[100, 200]]);
console.assert('BasicShape: x=100; y=200' == bs.toString(), 'new BasicShape([[100,200]]');

arc = new Arc(100, 200, 50, new Angle(0, 5));
console.assert('Arc: x=100; y=200, radius=50, radians1=0, radians2=5' == arc.toString());

