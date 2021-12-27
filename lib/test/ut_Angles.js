aa = new Angle(1, 2);
aa.add(10);
console.assert(aa.end == 5.716814692820414, 'Angle add failed');
aa.substract(10);
console.assert(aa.end == 2, 'Angle substract failed');
