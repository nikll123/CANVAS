
let obj1 = new Obj('obj1');
console.assert(obj1.id == 'obj1');

let obj2 = new ObjGraf('obj2', 100, 200);
console.assert(obj2.id == 'obj2');
console.assert(obj2.x == 100);
console.assert(obj2.y == 200);
