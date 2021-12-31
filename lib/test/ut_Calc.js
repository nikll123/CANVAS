console.assert(false == Calc.arraysEqual([1,2],[1,32]), 'false == Calc.arraysEqual([1,2],[1,32])');
console.assert(true == Calc.arraysEqual([1,2],[1,2]),'true == Calc.arraysEqual([1,2],[1,2]');
console.assert(false == Calc.arraysEqual([1,2],[1,2,3]), 'false == Calc.arraysEqual([1,2],[1,2,3])');

console.assert(10.26 == Calc.round(10.256, 2), '10.26 == Calc.round(10.256, 2)');
console.assert(10.25 == Calc.round(10.2545), '10.25 == Calc.round(10.2545, 2)');

