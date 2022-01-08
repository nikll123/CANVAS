//-------------------------------------
// BasicShape
// let bs = new BasicShape([[100, 200],[10, 20],[30, 50]], id = 'bs1');
//-------------------------------------
class BasicShape extends ObjGraf {
    constructor(pointsArg, id = 'bs') {
        let x = 0;
        let y = 0;
        if (pointsArg.length > 0) {
            x = pointsArg[0][0];
            y = pointsArg[0][1];
        }
        super(id, x, y)
        this.points = [];
        this.state = STATE.NORMAL;
        for (var i = 0; i < pointsArg.length; i++) {
            var p = pointsArg[i];
            var pp = new Point(p[0], p[1], 'p' + i);
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

    // toString() {
    //     let retval = super.toString();
    //     return retval + ': x=' + Calc.round(this.x) + '; y=' + Calc.round(this.y);
    // }

    showDetails(ctx) {
        let p1 = new Point(this.points[0].x, this.points[0].y, this.id)
        p1.showDetails(ctx);
    }

    build() {
        // place holder, must be overwritten by chilndren
    }

    render(ctx, lineWidth, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor)
    }
    draft(ctx, lineWidth = 1, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, DRAFT)
    }

    _render(ctx, lineWidth, colorStroke, fillColor, draft = false) {
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = colorStroke;
        this.build(ctx);
        if (lineWidth > 0) {
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            if (draft)
                ctx.setLineDash(DRAFT_LINE_PATTERN_5);
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
        if (this.hasOwnProperty('points'))
            this.points[0].x = x;
    }

    set y(y) {
        if (this.hasOwnProperty('points'))
            this.points[0].y = y;
    }

}

//-------------------------------------
// line broken
//-------------------------------------
class LineBroken extends BasicShape {
    constructor(pointsArg, id = 'lb') {
        super(pointsArg, id);
    }

    toString() {
        var reval = super.toString() + ':'
        for (var i = 0; i < this.points.length; i++) {
            reval = reval + this.points[i].toString() + ';';
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

    get startPoint() {
        let ret = undefined;
        if (this.points.length > 0)
            ret = points[0];
        return ret;

    }
    get endPoint() {
        let ret = undefined;
        if (this.points.length > 0)
            ret = points[points.length - 1];
        return ret;
    }
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
    constructor(x, y, radius, angle, ccw = globalCCW, id = 'arc') {
        super([[x, y]], id);
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

    showDetails(ctx) {
        super.showDetails(ctx);
        let t1 = new Text(this.startX + 1, this.startY + 10, 'b:' + Calc.round(this.radians1))
        t1.render(ctx);
        let t2 = new Text(this.endX + 1, this.endY - 4, 'e:' + Calc.round(this.radians2))
        t2.render(ctx);
    }

    render(ctx, lineWidth = 1, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor)
    }
    draft(ctx, lineWidth = 1, colorStroke = DRAFT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, DRAFT)
    }

    _render(ctx, lineWidth, colorStroke, fillColor, draft = false) {
        if (lineWidth > 0) {
            ctx.save();
            ctx.beginPath();
            this.build(ctx);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = colorStroke;
            if (draft)
                ctx.setLineDash(DRAFT_LINE_PATTERN_5);
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
            if (draft) {
                ctx.setLineDash(DRAFT_LINE_PATTERN_1);
                var x1 = this.x + Math.cos(this.radians1) * this.radius;
                var y1 = this.y + Math.sin(this.radians1) * this.radius;
                var x2 = this.x + Math.cos(this.radians2) * this.radius;
                var y2 = this.y + Math.sin(this.radians2) * this.radius;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(this.x, this.y);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    clip(ctx) {
        this.build(ctx);
        ctx.clip();
        Canvas.clearAll(ctx);
    }

    equal(ccl1) {
        return ccl1.x == this.x && ccl1.y == this.y && ccl1.radius == this.radius && ccl1.radians1 == this.radians1 && ccl1.radians2 == this.radians2;
    }

    get startXY() {
        return [this.startX, this.startY];
    }
    get endXY() {
        return [this.endX, this.endY];
    }

    get startX() {
        return this._x(this.radians1);
    }
    get endX() {
        return this._x(this.radians2);
    }
    _x(radians) {
        var v = this.x + this.radius * Math.cos(radians);
        return Calc.round(v);
    }

    get startY() {
        return this._y(this.radians1);
    }
    get endY() {
        return this._y(this.radians2);
    }
    _y(radians) {
        var v = this.y + this.radius * Math.sin(radians);
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
        return this._toString(FORMAT.LONG);
    };
    toStringShort() {
        return this._toString(FORMAT.SHORT);
    };
    _toString(fmt) {
        let txt = super.toString() + ',radius=' + Calc.round(this.radius);
        if (fmt == FORMAT.LONG)
            txt = txt + ',radians=[' + Calc.round(this.radians1) + ',' + Calc.round(this.radians2) + ']';
        return txt;
    }

    isPointInside(x, y) {
        var d = (this.x - x) ** 2 + (this.y - y) ** 2;
        return d <= this.radius ** 2;
    }
}

//-------------------------------------
// Circle
//-------------------------------------
class Circle extends Arc {
    constructor(x, y, radius, id = 'ccl') {
        super(x, y, radius, new Angle(0, DVA_PI), CW, id);
    }
    toString() {
        return super.toStringShort();
    };
}

//-------------------------------------
// CircleCombo
//-------------------------------------
class CircleCombo extends Circle {
    constructor(x, y, radius, angles = [new Angle(0, DVA_PI)], id = 'cclcmb') {
        super(x, y, radius, id);
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

    showDetails(ctx) {
        let p1 = new Point(this.points[0].x, this.points[0].y, this.id)
        p1.showDetails(ctx); // centre
        for (var i = 0; i < this.arcs.length; i++) {
            let t1 = new Text(this.arcs[i].startX + 1, this.arcs[i].startY + 10, 'b:' + Calc.round(this.arcs[i].radians1))
            t1.render(ctx);
            let t2 = new Text(this.arcs[i].endX + 1, this.arcs[i].endY - 4, 'e:' + Calc.round(this.arcs[i].radians2))
            t2.render(ctx);
        }
    }

    render(ctx, lineWidth, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, false)
    }
    draft(ctx, lineWidth = 1, colorStroke = DRAFT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, DRAFT)
    }

    _render(ctx, lineWidth, colorStroke = DEFAULT_COLOR, fillColor, draft) {
        if (lineWidth > 0) {
            ctx.save();
            for (var i = 0; i < this.arcs.length; i++) {
                this.arcs[i].x = this.x;
                this.arcs[i].y = this.y;
                this.arcs[i]._render(ctx, lineWidth, colorStroke, fillColor, draft);
            }
            ctx.restore();
        }
    };
}

//-------------------------------------
// Outline
//-------------------------------------
class Outline extends BasicShape {
    constructor(lines, id = 'ol') {
        super([], id);
        this.lines = [];
        for (var i = 0; i < lines.length; i++) {
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

    draft(ctx, lineWidth = 1, colorStroke = DRAFT_COLOR, fillColor) {
        if (lineWidth > 0) {
            ctx.save();
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].draft(ctx, lineWidth, colorStroke, fillColor);
            }
        }
        ctx.restore();
    }

    toString() {
        var retstr = super.toString() + ': ';
        for (var i = 0; i < this.lines.length; i++) {
            retstr = retstr + this.lines[i].toString() + ',';
        }
        return retstr;
    };

    // get x() {
    //     let x = undefined;
    //     if (this.points.length > 0) {
    //         x = this.points[0].x;
    //     }
    //     return x;
    // }
    // get y() {
    //     let y = undefined;
    //     if (this.points.length > 0) {
    //         y = this.points[0].y;
    //     }
    //     return y;
    // }
}
