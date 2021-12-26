//-------------------------------------
// point
//-------------------------------------

var defaultColor = '#888888';
var debugRender = true;
const PI = Math.PI;
const DVA_PI = 2 * PI;

class Calc {
    // https://cpp.mazurok.com/triangle/
    static isPointInsideTriangle(x, y, pointA, pointB, pointC) {
        var r1 = this._f2(pointA, pointB, pointC, x, y);
        var r2 = this._f2(pointB, pointC, pointA, x, y);
        var r3 = this._f2(pointC, pointA, pointB, x, y)
        var res = r1 && r2 && r3;
        return res;
    }
    // Вычисляет положение точки D(xd,yd) относительно прямой AB
    static _f1(p1, p2, x, y) {
        return (x - p1.x) * (p2.y - p1.y) - (y - p1.y) * (p2.x - p1.x);
    }

    // Лежат ли точки C и D с одной строны прямой (AB)?
    static _f2(p1, p2, p3, x, y) {
        return this._f1(p1, p2, p3.x, p3.y) * this._f1(p1, p2, x, y) >= 0;
    }

    static calcDistance(x1, y1, x2, y2)
    {
        var distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance;
    }

    static circleOverlap(c1, c2) {
        var distance = this.calcDistance (c1.x, c1.y, c2.x, c2.y);
        var angle11 = new Angle(0, DVA_PI);
        var angle12 = new Angle(0, 0);
        var angle21 = new Angle(0, DVA_PI);
        var angle22 = new Angle(0, 0);
        if (distance > c1.radius + c2.radius) {
            // do nothing
        }
        else if (distance < Math.abs(c1.radius - c2.radius)) {
            if (c1.radius > c2.radius)
                angle21.end = 0;
            else
                angle11.end = 0;
        }
        else {
            var angle_base = Math.asin((c2.y - c1.y) / distance);

            var angleBase = new Angle(0, angle_base);
            angleBase.render(ctx, 100, 400, 50);

            if (c1.x > c2.x)
                angle_base = PI - angle_base;

            // angle_d = Math.acos((r1 ** 2 + r2 ** 2 - distance ** 2) / (2 * r1 * r2));
            var c1rQ = c1.radius ** 2;
            var c2rQ = c2.radius ** 2;
            var dQ = distance ** 2;
            var k = 2 * distance;
            var angle_r1 = Math.acos((c1rQ + dQ - c2rQ) / (c1.radius * k));
            var angle_r2 = Math.acos((c2rQ + dQ - c1rQ) / (c2.radius * k));

            angle11.begin = angle_base + angle_r1;
            angle11.end = angle_base - angle_r1;

            // if (angle11.begin > 0 && angle11.end > 0 )
            // {}

            angle11.render(ctx, c1.x, c1.y, c1.radius);

            angle21.begin = PI + angle_base + angle_r2;
            angle21.end = PI + angle_base - angle_r2;
        }
        return [angle11, angle21];
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString(long = true) {
        var retval;
        if (long)
            retval = this.constructor.name + ': ' + 'x=' + this.x + ', y=' + this.y;
        else
            retval = this.x + ' ' + this.y;
        return retval;
    };

    render(ctx, radius = 0, color = defaultColor) {
        if (radius > 0) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, DVA_PI);
            ctx.fill();
            ctx.restore();
        }
        if (debugRender) {
            var text = this.toString(false);
            ctx.fillText(text, this.x + radius + 1, this.y - radius - 1);
        }
    };

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

class Angle {
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }

    render(ctx, x, y, radius = 0, color = defaultColor) {
        if (radius > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            var x1 = x + Math.cos(this.begin) * radius;
            var y1 = y + Math.sin(this.begin) * radius;
            var x2 = x + Math.cos(this.end) * radius;
            var y2 = y + Math.sin(this.end) * radius;
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            // ctx.arc(x, y, radius, this.begin, this.end);
            ctx.restore();
            if (debugRender) {
                ctx.fillText('b:' + this.begin.toFixed(2), x1 + 1, y1 - 1);
                ctx.fillText('e:' + this.end.toFixed(2), x2 + 1, y2 - 1);
            }
        }
    }

    toString() {
        var retval = this.constructor.name + ': ';
        retval = retval + this.begin + ' ' + this.end;
        return retval;
    };

    static calcAngle(x1, y1, x2, y2)
    {

    }
}

//-------------------------------------
// BasicShape
//-------------------------------------
class BasicShape {
    constructor(pointsArg) {
        this.points = [];
        for (var i = 0; i < pointsArg.length; i++) {
            var p = pointsArg[i];
            var pp = new Point(p[0], p[1]);
            this.points.push(pp);
        }
    }

    move(dx, dy) {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].move(dx, dy);
        };
    }

    moveIfDragging(dx, dy) {
        if (this.isDragging)
            this.move(dx, dy);
    }

    isPointInside(x, y) {
        return false;
    }

    startDrag() {
        this.isDragging = true;
    }

    stopDrag() {
        this.isDragging = false;
    }

    startDrugIfPointIsInside(x, y) {
        if (this.isPointInside(x, y))
            this.startDrag();
    }

    get x() {
        return this.points[0].x;
    }

    get y() {
        return this.points[0].y;
    }

    set x(x) {
        this.points[0].x = x;
    }

    set y(y) {
        this.points[0].y = y;
    }

}

//-------------------------------------
// line broken
//-------------------------------------
class LineBroken extends BasicShape {
    constructor(pointsArg) {
        super(pointsArg);
    }

    toString() {
        var reval = this.constructor.name + ': '
        for (var i = 0; i < this.points.length; i++) {
            reval = reval + this.points[i].toString() + '; ';
        };
        return reval;
    }

    render(ctx, widthStroke = 0, closePath = false, colorStroke = defaultColor, colorFill) {
        if (widthStroke > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            var p = this.points[0];
            p.render(ctx);
            for (var i = 1; i < this.points.length; i++) {
                p = this.points[i]
                ctx.lineTo(p.x, p.y);
                p.render(ctx);
            };
            if (closePath)
                ctx.closePath();
            ctx.strokeStyle = colorStroke;
            ctx.lineWidth = widthStroke;
            ctx.stroke();
            if (colorFill != undefined) {
                ctx.fillStyle = colorFill;
                ctx.fill();
            }
            ctx.restore();
        }
    };
}

//-------------------------------------
// poligon
//-------------------------------------
class Poligon extends LineBroken {
    constructor(pointsArg, anglecount) {
        if (pointsArg.length == anglecount) {
            super(pointsArg);
            this.isDragging = false;
        }
        else
            console.debug('Failed to create due to wrong number of points');
    }

    render(ctx, widthStroke = 0, colorStroke = defaultColor, colorFill) {
        super.render(ctx, widthStroke, true, colorStroke, colorFill);
    }
}

//-------------------------------------
// triangle
//-------------------------------------
class Triangle extends Poligon {
    constructor(pointsArg) {
        super(pointsArg, 3);
    }
    isPointInside(x, y) {
        return Calc.isPointInsideTriangle(x, y, this.points[0], this.points[1], this.points[2]);
    }
}

//-------------------------------------
// quadrangle
//-------------------------------------
class Quadrangle extends Poligon {
    constructor(pointsArg) {
        super(pointsArg, 4);
    }
    isPointInside(x, y) {
        var r1 = Calc.isPointInsideTriangle(x, y, this.points[0], this.points[1], this.points[2]);
        var r2 = Calc.isPointInsideTriangle(x, y, this.points[0], this.points[2], this.points[3]);
        return r1 || r2;
    }
}

//-------------------------------------
// rectangle
//-------------------------------------
class Rectangle extends BasicShape {
    constructor(x, y, width, height) {
        super([[x, y]]);
        this.width = width;
        this.height = height;
    }

    render(ctx, lineWidth, fillColor = defaultColor) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', width=' + this.width + ', height=' + this.height;
    };

    isPointInside(x, y) {
        var r1 = x >= this.x && x <= this.x + this.width;
        var r2 = y >= this.y && y <= this.y + this.height;
        return r1 && r2;
    }
}

//-------------------------------------
// arc
//-------------------------------------
class Arc extends BasicShape {
    constructor(x, y, radius, angle, cw = true) {
        super([[x, y]]);
        this.radius = radius;
        this.radians1 = angle.begin;
        this.radians2 = angle.end;
        this.cw = cw;
    }

    render(ctx, lineWidth, colorStroke = defaultColor, fillColor) {
        ctx.save();
        if (ctx.lineWidth > 0) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = colorStroke;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, this.radians1, this.radians2, false, this.cw);
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
            this.points[0].render(ctx, 1);
        }
        ctx.restore();
    };

    toString() {
        return super.toString() + ', radius=' + this.radius + ', radians1=' + this.radians1 + ', radians2=' + this.radians2;
    };

    isPointInside(x, y) {
        var d = (this.x - x) ** 2 + (this.y - y) ** 2;
        return d <= this.radius ** 2;
    }
}

class Circle extends Arc {
    constructor(x, y, radius) {
        super(x, y, radius, new Angle(0, DVA_PI));
    }
}

class CircleCombi extends Circle {
    constructor(x, y, radius, angles = [[0, DVA_PI]]) {
        super(x, y, radius);
        this.arcs = [];
        for (var i = 0; i < angles.length; i++) {
            var a = angles[i];
            var aa = new Arc(this.x, this.y, radius, a[0], a[1]);
            console.debug(aa.toString());
            this.arcs.push(aa);
        }
    }

    render(ctx, lineWidth, colorStroke = defaultColor, fillColor) {
        ctx.save();

        if (lineWidth > 1)  // draw base circle
            (new Circle(this.x, this.y, this.radius)).render(ctx, 1);

        if (ctx.lineWidth > 0) {
            for (var i = 0; i < this.arcs.length; i++) {
                this.arcs[i].x = this.x;
                this.arcs[i].y = this.y;
                this.arcs[i].render(ctx, lineWidth, colorStroke = defaultColor, fillColor);
            }
        }
        ctx.restore();
    };
}

