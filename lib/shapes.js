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
        this._process(ctx, lineWidth, colorStroke, fillColor, '');
    }

    clip(ctx) {
        this._process(ctx, 0, defaultColor, undefined, 'clip');
    }

    _process(ctx, lineWidth, colorStroke, fillColor, type) {
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = colorStroke;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.radians1, this.radians2, false, this.cw);
        if (type === 'clip') {
            ctx.clip();
            clearAll(ctx);
        }
        else if (lineWidth > 0) {
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
            if (debugRender)
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

class CircleCombo extends Circle {
    constructor(x, y, radius, angles = [[0, DVA_PI]]) {
        super(x, y, radius);
        this.setArcs(angles);
    }

    setArcs(angles) {
        this.arcs = [];
        for (var i = 0; i < angles.length; i++) {
            var a = angles[i];
            var aa = new Arc(this.x, this.y, this.radius, a);
            // console.debug(aa.toString());
            this.arcs.push(aa);
        }
    }

    render(ctx, lineWidth, colorStroke = defaultColor, fillColor) {
        ctx.save();

        if (debugRender)  // draw base circle
            (new Circle(this.x, this.y, this.radius)).render(ctx, 1);

        if (lineWidth > 0) {
            for (var i = 0; i < this.arcs.length; i++) {
                this.arcs[i].x = this.x;
                this.arcs[i].y = this.y;
                this.arcs[i].render(ctx, lineWidth, colorStroke, fillColor);
            }
        }
        ctx.restore();
    };
}

