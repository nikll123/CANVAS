//-------------------------------------
// arc
//-------------------------------------
class Arc extends BasicShape {
    constructor(x, y, radius, angle, ccw = CW, id = 'arc') {
        super([[x, y]], id);
        this.radius = radius;
        this.radians1 = angle.begin;
        this.radians2 = angle.end;
        this.ccw = ccw;
    }

    build(ctx) {
        ctx.arc(this.x, this.y, this.radius, this.radians1, this.radians2, this.ccw);
    };

    showDetails(ctx) {
        super.showDetails(ctx);
        let t1 = new Text(this.startX + 1, this.startY + 10, 'b:' + Calc.round(this.radians1,2))
        t1.render(ctx);
        let t2 = new Text(this.endX + 1, this.endY - 4, 'e:' + Calc.round(this.radians2,2))
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
                ctx.setLineDash(DRAFT_LINE_PATTERN_3);
                let x1 = this.x + Math.cos(this.radians1) * this.radius;
                let y1 = this.y + Math.sin(this.radians1) * this.radius;
                let x2 = this.x + Math.cos(this.radians2) * this.radius;
                let y2 = this.y + Math.sin(this.radians2) * this.radius;
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
        let v = this.points[0].x + this.radius * Math.cos(radians);
        return Calc.round(v);
    }

    get startY() {
        return this._y(this.radians1);
    }
    get endY() {
        return this._y(this.radians2);
    }
    _y(radians) {
        let v = this.points[0].y + this.radius * Math.sin(radians);
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
        let txt = super.toString() + ':';
        if (fmt == FORMAT.LONG) {
            txt = txt + 'x=' + Calc.round(this.x) + ',y=' + Calc.round(this.y);
            txt = txt + ',radius=' + Calc.round(this.radius);
            if (this.type == 'Arc')
                txt = txt + ',radians=[' + Calc.round(this.radians1) + ',' + Calc.round(this.radians2) + ']';
        }
        else {
            txt = txt + Calc.round(this.x) + ',' + Calc.round(this.y);
            txt = txt + ',' + Calc.round(this.radius);
            txt = txt + ',[' + Calc.round(this.radians1) + ',' + Calc.round(this.radians2) + ']';
            if (this.type == 'Arc')
                txt = txt + ',radians=[' + Calc.round(this.radians1) + ',' + Calc.round(this.radians2) + ']';
        }

        return txt;
    }

    isPointInside(x, y) {
        let d = (this.x - x) ** 2 + (this.y - y) ** 2;
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
        for (let i = 0; i < angles.length; i++) {
            let a = angles[i];
            let aa = new Arc(this.x, this.y, this.radius, a);
            // console.debug(aa.toString());
            this.arcs.push(aa);
        }
    }

    showDetails(ctx) {
        let p1 = new Point(this.points[0].x, this.points[0].y, this.id)
        p1.showDetails(ctx); // centre
        for (let i = 0; i < this.arcs.length; i++) {
            let t1 = new Text(this.arcs[i].startX + 1, this.arcs[i].startY + 10, 'b:' + Calc.round(this.arcs[i].radians1,2))
            t1.render(ctx);
            let t2 = new Text(this.arcs[i].endX + 1, this.arcs[i].endY - 4, 'e:' + Calc.round(this.arcs[i].radians2,2))
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
            for (let i = 0; i < this.arcs.length; i++) {
                this.arcs[i].x = this.x;
                this.arcs[i].y = this.y;
                this.arcs[i]._render(ctx, lineWidth, colorStroke, fillColor, draft);
            }
            ctx.restore();
        }
    };

    move(dx, dy) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].move(dx, dy);
            for (let j = 0; j < this.arcs.length; j++)
                this.arcs[j].move(dx, dy)
        };
    }
}

