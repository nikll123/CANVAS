function O(i) { return typeof i == 'object' ? i : document.getElementById(i) };
function S(i) { return O(i).style };
function C(i) { return document.getElementsByClassName(i) }
function CD(value) { console.debug(value) };                    // console debug
function PD(x, y, r = 2) { (new Point(x, y)).render(ctx, r); }  // point draw
// function PIS(x, y) { return ctx.isPointInStroke(x, y);}         // Point In Stroke
function PIP(x, y) { return ctx.isPointInPath(x, y); }           // Point In Path

function PIS(x, y, p = null) {                                  // Point In Stroke
    if (p == null)
        return ctx.isPointInStroke(x, y);
    else
        return ctx.isPointInStroke(p, x, y);
}         