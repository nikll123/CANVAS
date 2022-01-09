console.assert(false == Calc.arraysEqual([1,2],[1,32]));
console.assert(true == Calc.arraysEqual([1,2],[1,2]));
console.assert(false == Calc.arraysEqual([1,2],[1,2,3]));

console.assert(10.26 == Calc.round(10.256, 2));
console.assert(10.25 == Calc.round(10.2545,2));
console.assert(10.25451235 == Calc.round(10.2545123456));

console.assert( Calc.arraysEqual([1,2,3], [1,2,3]));
console.assert(!Calc.arraysEqual([1,2,3], [1,2,31]));
console.assert(!Calc.arraysEqual([1,2,3], [1,2]));

console.assert(Calc.arraysEqual([10.12345678], [10.123456786]));
console.assert(Calc.arraysEqual([10.12345678], [10.123456776]));
console.assert(!Calc.arraysEqual([10.12345678], [10.123456792]));


