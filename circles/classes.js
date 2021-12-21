//-------------------------------------
// point
//-------------------------------------

var defaultColor = '#888888';
var debugRender = true;

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

    static circleOverlap(circle1, circle2) {
        var x1 = circle1.points[0].x;
        var y1 = circle1.points[0].y;
        var r1 = circle1.radius;

        var x2 = circle2.points[0].x;
        var y2 = circle2.points[0].y;
        var r2 = circle2.radius;
        var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var angle1_start = 0;
        var angle1_stop = Math.PI;
        var angle2_start = 0;
        var angle2_stop = Math.PI;

        if (distance < r1 + r2 && distance > Math.abs(r1 - r2)) {
            var angle_base = Math.asin((y2 - y1) / distance);
            // angle_d = Math.acos((r1 ** 2 + r2 ** 2 - distance ** 2) / (2 * r1 * r2));
            var angle_r2 = Math.acos((r2 ** 2 + distance ** 2 - r1 ** 2) / (2 * r2 * distance));
            var angle_r1 = Math.acos((r1 ** 2 + distance ** 2 - r2 ** 2) / (2 * r1 * distance));

            angle1_start = angle_base - angle_r1;
            angle1_stop = angle_base + angle_r1;

            angle2_start = Math.PI + angle_base - angle_r2;
            angle2_stop = Math.PI + angle_base + angle_r2;
        }
        return [angle1_start, angle1_stop, angle2_start, angle2_stop];
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
            retval = this.x + ',' + this.y;
        return retval;
    };

    render(ctx, radius = 0, color = defaultColor) {
        if (radius > 0) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
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
            ctx.moveTo(this.points[0].x, this.points[0].y);
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
        ctx.rect(this.points[0].x, this.points[0].y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', width=' + this.width + ', height=' + this.height;
    };

    isPointInside(x, y) {
        var r1 = x >= this.points[0].x && x <= this.points[0].x + this.width;
        var r2 = y >= this.points[0].y && y <= this.points[0].y + this.height;
        return r1 && r2;
    }
}

//-------------------------------------
// arc
//-------------------------------------
class Arc extends BasicShape {
    constructor(x, y, radius, radians1, radians2, cw = true) {
        super([[x, y]]);
        this.radius = radius;
        this.radians1 = radians1;
        this.radians2 = radians2;
        this.cw = cw;
    }

    render(ctx, lineWidth, colorStroke = defaultColor, fillColor) {
        ctx.save();
        if (fillColor != undefined)
            ctx.fillStyle = fillColor;
        if (lineWidth > 0) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = colorStroke;
        }
        ctx.beginPath();
        ctx.arc(this.points[0].x, this.points[0].y, this.radius, this.radians1, this.radians2, false, this.cw);
        if (fillColor != undefined)
            ctx.fill();
        if (ctx.lineWidth > 0)
            ctx.stroke();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', radius=' + this.radius + ', radians1=' + this.radians1 + ', radians2=' + this.radians2;
    };

    isPointInside(x, y) {
        var d = (this.points[0].x - x) ** 2 + (this.points[0].y - y) ** 2;
        return d <= this.radius ** 2;
    }
}

class Circle extends Arc {
    constructor(x, y, radius) {
        super(x, y, radius, 0, 2 * Math.PI);
    }
}

