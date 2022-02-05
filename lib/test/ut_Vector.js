// let l1 = new Vector(50,50,50,300, 'l1');
// let l2 = new Vector(150,50,150,300, 'l2');

console.assert((new Vector(10, 10, 10, 10)).azimuth == AZIMUTH.NONE);
console.assert((new Vector(10, 10, 10, 20)).azimuth == AZIMUTH.S);
console.assert((new Vector(10, 20, 10, 10)).azimuth == AZIMUTH.N);
console.assert((new Vector(10, 10, 20, 10)).azimuth == AZIMUTH.E);
console.assert((new Vector(20, 10, 10, 10)).azimuth == AZIMUTH.W);
console.assert((new Vector(10, 10, 20, 20)).azimuth == AZIMUTH.ES);
console.assert((new Vector(10, 10, 0, 20)).azimuth == AZIMUTH.SW);
console.assert((new Vector(10, 10, 0, 0)).azimuth == AZIMUTH.WN);
console.assert((new Vector(10, 10, 20, 0)).azimuth == AZIMUTH.NE);

let vc1 = new VectorComposite(100, 100, 200, 200,[[10,40],[60,90]],'vc1');

// console.assert( );






