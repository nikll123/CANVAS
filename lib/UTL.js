function O(i) { return typeof i == 'object' ? i : document.getElementById(i) };
function S(i) { return O(i).style };
function C(i) { return document.getElementsByClassName(i) }
function CD(value) { console.debug(value) };                    // console debug
function PD(x, y, r = 2) { (new Point(x, y)).render(ctx, r); }   // point draw
function IPIS(x, y) { return ctx.isPointInStroke(x, y);}
function IPIP(x, y) { return ctx.isPointInPath(x, y);}
