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

    moveToStart(ctx) {
        ctx.moveTo(this.x, this.y);
    };

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

    toString() {
        return this.type + ': x=' + Calc.round(this.x) + '; y=' + Calc.round(this.y);
    }

    render(ctx, lineWidth, colorStroke = DEFAULT_COLOR, fillColor) {
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = colorStroke;
        this.build(ctx);
        if (lineWidth > 0) {
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    get type() {
        return this.constructor.name;
    }

    get x() {
        var x = undefined;
        if (this.points.length > 0)
            x = this.points[0].x;
        return x;
    }

    get y() {
        var y = undefined;
        if (this.points.length > 0)
            y = this.points[0].y;
        return y;
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

    render(ctx, widthStroke = 0, closePath = false, colorStroke = DEFAULT_COLOR, colorFill) {
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

    render(ctx, widthStroke = 0, colorStroke = DEFAULT_COLOR, colorFill) {
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

    render(ctx, lineWidth, fillColor = DEFAULT_COLOR) {
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
    constructor(x, y, radius, angle, ccw = globalCCW) {
        super([[x, y]]);
        this.radius = radius;
        this.radians1 = angle.begin;
        this.radians2 = angle.end;
        this.ccw = ccw;
    }

    build(ctx, ccw = CW) {
        if (ccw == CCW) {
            var tmp = this.radians1;
            this.radians1 = this.radians2;
            this.radians2 = tmp;
        }
        ctx.arc(this.x, this.y, this.radius, this.radians1, this.radians2, ccw);
    };

    render(ctx, lineWidth, colorStroke = DEFAULT_COLOR, fillColor) {
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = colorStroke;
        ctx.beginPath();
        this.build(ctx);
        // ctx.closePath();
        if (lineWidth > 0) {
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
            if (globalDebugMode)
                this.points[0].render(ctx, 1);
        }
        ctx.restore();
    }

    clip(ctx) {
        this.build(ctx);
        ctx.clip();
        clearAll(ctx);
    }

    get startXY() {
        return [this.startX, this.startY];
    }
    get endXY() {
        return [this.endX, this.endY];
    }

    get startX() {
        var v = this.x + this.radius * Math.cos(this.radians1);
        return Calc.round(v);
    }
    get startY() {
        var v = this.y + this.radius * Math.sin(this.radians1);
        return Calc.round(v);
    }

    get endX() {
        var v = this.x + this.radius * Math.cos(this.radians2);
        return Calc.round(v);
    }
    get endY() {
        var v = this.y + this.radius * Math.sin(this.radians2);
        return Calc.round(v);
    }

    get isCircle() {
        return this.radians2 - this.radians1 == DVA_PI;
    }

    get startPoint() {
        return new Point(this.startX, this.startY);
    }

    get endPoint() {
        return new Point(this.endX, this.endY);
    }

    moveToStart(ctx) {
        ctx.moveTo(this.startX, this.startY);
    };

    toString() {
        return super.toString() + ', radius=' + Calc.round(this.radius) + ', radians=[' + Calc.round(this.radians1) + ',' + Calc.round(this.radians2) + ']';
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
    constructor(x, y, radius, angles = [new Angle(0, DVA_PI)]) {
        super(x, y, radius);
        this.setAngles(angles);
    }

    setAngles(angles) {
        this.arcs = [];
        for (var i = 0; i < angles.length; i++) {
            var a = angles[i];
            var aa = new Arc(this.x, this.y, this.radius, a);
            // console.debug(aa.toString());
            this.arcs.push(aa);
        }
    }

    render(ctx, lineWidth, colorStroke = DEFAULT_COLOR, fillColor) {
        ctx.save();

        if (globalDebugMode)  // draw base circle
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

class Outline extends BasicShape {
    constructor(lines) {
        super([]);
        this.lines = [];
        for (var i = 0; i < this.lines.length; i++) {
            var l = lines[i];
            this.lines.push(l);
        }
    }

    push(line) {
        this.lines.push(line);
        this.points.push(line.startPoint);
        this.points.push(line.endtPoint);
    }

    build(ctx, ccw = CW) {
        // ctx.moveTo(this.x, this.y);
        if (ccw == CW) {
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].build(ctx, CW);
            }
        }
        else {
            for (var i = this.lines.length; i > 0; i--) {
                this.lines[i - 1].build(ctx, CCW);
            }
        }


    }

    toString() {
        var retstr = super.toString() + ': ';
        for (var i = 0; i < this.lines.length; i++) {
            retstr = retstr + this.lines[i].toString() + ';';
        }
        return retstr;
    };
}
