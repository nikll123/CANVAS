//-------------------------------------
// point
//-------------------------------------

var defaultColor = '#888888';
var debugRender = true;

class calc {
    // https://cpp.mazurok.com/triangle/
    static isPointInsideTriangle(x, y, pointA, pointB, pointC) {
        var r1 = this._f2(pointA, pointB, pointC, x, y);
        var r2 = this._f2(pointB, pointC, pointA, x, y);
        var r3 = this._f2(pointC, pointA, pointB, x, y)
        // printf(	f(a,b,c,d) && f(b,c,a,d) && f(c,a,b,d) ? "yes" : "no");
        var res = r1 && r2 && r3;
        return res;
    }
    // Вычисляет положение точки D(xd,yd) относительно прямой AB

    static _f1(p1, p2, x, y) {
        return (x - p1.x) * (p2.y - p1.y) - (y - p1.y) * (p2.x - p1.x);
        // return (d.x - a.x) * (b.y - a.y) - (d.y - a.y) * (b.x - a.x);
    }

    // Лежат ли точки C и D с одной строны прямой (AB)?
    static _f2(p1, p2, p3, x, y) {
        return this._f1(p1, p2, p3.x, p3.y) * this._f1(p1, p2, x, y) >= 0;
        // return g(a, b, c) * g(a, b, d) >= 0;
    }

}

class point {
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
// line broken
//-------------------------------------
class lineBroken {
    constructor(points1) {
        this.points = [];
        for (var i = 0; i < points1.length; i++) {
            var p = points1[i];
            var pp = new point(p[0], p[1]);
            this.points.push(pp);
        }
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

    move(dx, dy) {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].move(dx, dy);
        };
    }
}

//-------------------------------------
// poligon
//-------------------------------------
class poligon extends lineBroken {
    constructor(points, anglecount) {
        if (points.length == anglecount) {
            super(points);
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
class triangle extends poligon {
    constructor(points) {
        super(points, 3);
    }
    isPointInside(x, y) {
        return calc.isPointInsideTriangle(x, y, this.points[0], this.points[1], this.points[2]);
    }
}

//-------------------------------------
// quadrangle
//-------------------------------------
class quadrangle extends poligon {
    constructor(points) {
        super(points, 4);
    }
    isPointInside(x, y) {
        var r1 = calc.isPointInsideTriangle(x, y, this.points[0], this.points[1], this.points[2]);
        var r2 = calc.isPointInsideTriangle(x, y, this.points[0], this.points[2], this.points[3]);
        return r1 || r2;
    }
}

//-------------------------------------
// shapes
//-------------------------------------
class shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDragging = false;
    }

    toString() {
        return this.constructor.name + ':  x=' + this.x + ', y=' + this.y;
    };
}

//-------------------------------------
// rectangle
//-------------------------------------
class rectangle extends shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    render(ctx, lineWidth, fillColor = defaultColor) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.strokeWidth = lineWidth;
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
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

}

//-------------------------------------
// arc
//-------------------------------------
class arc extends shape {
    constructor(x, y, radius, radians) {
        super(x, y);
        this.radius = radius;
        this.radians = radians;
    }

    render(ctx, lineWidth, fillColor = defaultColor) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.strokeWidth = lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);
        ctx.fill();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', radius=' + this.radius + ', radians=' + this.radians;
    };

    isPointInside(x, y) {
        var d = (this.x - x) ** 2 + (this.y - y) ** 2;
        return d <= this.radius ** 2;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

class circle extends arc {
    constructor(x, y, radius) {
        super(x, y, radius, 2 * Math.PI);
    }
}

