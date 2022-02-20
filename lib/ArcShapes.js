//-------------------------------------
// arc
//-------------------------------------
class Arc extends BasicShape {
    constructor(x, y, radius, angle, ccw = CW, id = 'arc') {
        super([[x, y]], id);
        this.radius = radius;
        this.angle = angle;
        this.ccw = ccw;
        this.checkConsistance();
    }

    checkConsistance() {
        if (this.ccw)
            console.assert(this.begin >= this.end)
        else
            console.assert(this.end >= this.begin)
    }

    clone() {
        return new Arc(this.x, this.y, this.radius, this.angle, this.ccw, id + '_clone');
    }

    toPath() {
        let path = new Path2D();
        path.arc(this.x, this.y, this.radius, this.begin, this.end, this.ccw);
        return path;
    }

    showDetails(ctx, ptrs = 0) {
        super.showDetails(ctx);
        if (ptrs == 0 || ptrs == 1) {
            let t1 = new Text(this.beginX + 1, this.beginY + 10, Calc.round(this.begin, 2))
            t1.render(ctx);
        }
        if (ptrs == 0 || ptrs == 2) {
            let t2 = new Text(this.endX + 1, this.endY - 4, Calc.round(this.end, 2))
            t2.render(ctx);
        }
    }

    build(ctx) {
        ctx.arc(this.x, this.y, this.radius, this.begin, this.end, this.ccw);
    };

    buildInOutLine(ctx) {
        this.build(ctx);
    }

    render(ctx, lineWidth = 1, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor)
    }

    draft(ctx, lineWidth = 1, colorStroke = DRAFT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, RENDER_DRAFT)
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
                ctx.beginPath();
                ctx.moveTo(this.beginX, this.beginY);
                ctx.lineTo(this.x, this.y);
                ctx.lineTo(this.endX, this.endY);
                ctx.stroke();
                let size = 8 + lineWidth;
                drawArrowArc(ctx, this.x, this.y, this.radius, this.end, this.ccw, size);
            }
            ctx.restore();
        }
    }

    clip(ctx) {
        this.build(ctx);
        ctx.clip();
        Canvas.clearAll(ctx);
    }

    splitXY(ctx, x, y) {
        let resArcs = [this.clone()];
        if (this.isPointInStroke(ctx, x, y)) {
            let a = Calc.getAngle(this.x, this.y, x, y)
            resArcs = [];
            let a1 = new Angle(this.begin, a);
            a1.normalizeEnd(this.ccw);
            resArcs.push(new Arc(this.x, this.y, this.radius, new Angle(this.begin, a1.end), this.ccw));
            a1 = new Angle(a1.end, this.end);
            a1.normalizeEnd(this.ccw);
            resArcs.push(new Arc(this.x, this.y, this.radius, a1, this.ccw));
        }
        return resArcs;
    }

    splitAngs(angs) {  // angs - array of angle values
        let res = [this.clone()];
        if (angs.length > 0) {
            res = [];
            angs.push(this.begin);
            angs.push(this.end);
            // for (let i = 0; i < angs.length; i++) {
            //     angs[i] = Calc.angleNormalize(angs[i]);
            // }
            Calc.sortUniqueNum(angs, this.ccw);
            // Calc.rearrange around circle
            let aBeg = angs[0];
            for (let i = 1; i < angs.length; i++) {
                let aEnd = angs[i];
                let a1 = this.clone();
                a1.angle = new Angle(aBeg, aEnd);
                aBeg = aEnd;
                res.push(a1);
            }
        }
        return res;
    }

    equal(ccl1) {
        return ccl1.x == this.x && ccl1.y == this.y && ccl1.radius == this.radius && ccl1.begin == this.begin && ccl1.end == this.end;
    }

    visualize(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.begin, this.end, this.ccw)
        ctx.stroke();
        drawArrowArc(ctx, this.x, this.y, this.radius, this.end, this.ccw);
    }

    getPath() {
        let p = new Path2D();
        p.moveTo(this.beginX, this.beginY)
        p.arc(this.x, this.y, this.radius, this.begin, this.end, this.ccw);
        return p;
    }


    get ccw_coeff() {
        let coeff = 1;
        if (this.ccw == CCW)
            coeff = -1;
        return coeff;
    }

    get begin() {
        return this.angle.begin;
    }
    set begin(value) {
        this.angle.begin = value;
        this.checkConsistance();
    }

    get end() {
        return this.angle.end;
    }
    set end(value) {
        this.angle.end = value;
        this.checkConsistance();
    }

    get beginXY() {
        return [this.beginX, this.beginY];
    }
    get endXY() {
        return [this.endX, this.endY];
    }

    get beginX() {
        return this._x(this.begin);
    }
    get endX() {
        return this._x(this.end);
    }
    _x(radians) {
        let v = this.points[0].x + this.radius * Math.cos(radians);
        return v;
    }

    get beginY() {
        return this._y(this.begin);
    }
    get endY() {
        return this._y(this.end);
    }
    _y(radians) {
        let v = this.points[0].y + this.radius * Math.sin(radians);
        return v;
    }

    get isCircle() {
        return Math.abs(this.end - this.begin) == DVA_PI;
    }

    moveToStart(ctx) {
        ctx.moveTo(this.beginX, this.beginY);
    };

    toString() {
        let txt = super.toString() + ':';
        txt = txt + 'x=' + Calc.round(this.x) + ',y=' + Calc.round(this.y);
        txt = txt + ',radius=' + Calc.round(this.radius);
        if (this.type == 'Arc')
            txt = txt + ',radians=[' + Calc.round(this.begin) + ',' + Calc.round(this.end) + ']';
        return txt;
    }

    isPointInPath(ctx, x, y) {
        let p = this.getPath();
        return ctx.isPointInPath(p, x, y);
    }

    isPointInStroke(ctx, x, y) {
        let p = this.getPath();
        return ctx.isPointInStroke(p, x, y);
    }

    reverse() {
        this.angle.reverse();
    }

    normalize() {
        this.angle.normalize();
        if (this.ccw == CW) {
            if (this.angle.end < this.angle.begin)
                this.angle.end = this.angle.end + DVA_PI;
        }
        else { // CCW
            if (this.angle.end > this.angle.begin)
                this.angle.end = this.angle.end - DVA_PI;
        }
    }
}

//-------------------------------------
// Circle
//-------------------------------------
class Circle extends Arc {
    constructor(x, y, radius, ccw = false, id = 'ccl') {
        let k = 1;
        if (ccw)
            k = -1;
        super(x, y, radius, new Angle(0, k * DVA_PI), ccw, id);
    }
}

//-------------------------------------
// CircleComposite
//-------------------------------------
class CircleComposite extends Circle {
    constructor(x, y, radius, angles = [Angle.DVA_PI], ccw = CW, id = 'cclcmb') {
        super(x, y, radius, ccw, id);
        this.setAngles(angles);
    }

    setAngles(angles) {
        this.arcs = [];
        this.pushAngles(angles)
    }

    pushAngles(angles) {
        for (let i = 0; i < angles.length; i++) {
            let a = angles[i];
            let aa = new Arc(this.x, this.y, this.radius, a, this.ccw);
            // console.debug(aa.toString());
            this.arcs.push(aa);
        }
    }

    showDetails(ctx) {
        let p1 = new Point(this.points[0].x, this.points[0].y, this.id)
        p1.showDetails(ctx); // centre
        for (let i = 0; i < this.arcs.length; i++) {
            let t1 = new Text(this.arcs[i].beginX + 1, this.arcs[i].beginY + 10, Calc.round(this.arcs[i].begin, 2))
            t1.render(ctx);
            let t2 = new Text(this.arcs[i].endX + 1, this.arcs[i].endY - 4, Calc.round(this.arcs[i].end, 2))
            t2.render(ctx);
        }
    }

    render(ctx, lineWidth = 1, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, RENDER_NORMAL)
    }
    draft(ctx, lineWidth = 1, colorStroke = DRAFT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, RENDER_DRAFT)
    }

    build(ctx) {
        for (let i = 0; i < this.arcs.length; i++) {
            this.arcs[i].moveToStart(ctx);
            this.arcs[i].x = this.x;
            this.arcs[i].y = this.y;
            this.arcs[i].build(ctx);
        }
    }

    _render(ctx, lineWidth, colorStroke, fillColor, draft) {
        ctx.save();
        if (draft) {
            for (let i = 0; i < this.arcs.length; i++)
                this.arcs[i].draft(ctx, lineWidth, colorStroke);
        }
        else {
            ctx.beginPath();
            this.build(ctx);
            if (lineWidth > 0) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = colorStroke;
                if (draft == RENDER_DRAFT)
                    ctx.setLineDash(DRAFT_LINE_PATTERN_5);
                ctx.stroke();
            }
            if (fillColor != undefined) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
        }
        ctx.restore();
    };

    move(dx, dy) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].move(dx, dy);
            for (let j = 0; j < this.arcs.length; j++)
                this.arcs[j].move(dx, dy)
        };
    }

    moveToStart(ctx) {
        if (this.arcs.length > 0)
            ctx.moveTo(this.arcs[0].beginX, this.arcs[0].beginY);
    };

    visualize(ctx) {
        for (let i = 0; i < this.arcs.length; i++) {
            let arc1 = this.arcs[i];
            arc1.radius = Math.max(arc1.radius - (i + 1) * 5, 10);
            arc1.visualize(ctx);
        }
    }

    get isCircle() {
        let res = this.arcs.length == 2;
        if (res) {
            res = this.arcs[0].begin == 0 &&
                this.arcs[0].end == DVA_PI &&
                this.arcs[1].begin == DVA_PI &&
                this.arcs[1].end == DVA_PI
        }
        return res;
    }

    mergeArcs() {
        let doMerge = false;
        for (let i = 0; i < this.arcs.length; i++) {
            const arc = this.arcs[i];
            arc.normalize();
            for (let j = i + 1; j < this.arcs.length; j++) {
                const arc2 = this.arcs[j];
                doMerge = doMerge || arc.isPointInStroke(ctx, arc2.beginX, arc2.beginY) || arc.isPointInStroke(ctx, arc2.endX, arc2.endY);
            }
        }
        if (doMerge) {
            let angle_points = [];
            for (let i = 0; i < this.arcs.length; i++) {
                const arc = this.arcs[i];
                angle_points.push(arc.begin);
                angle_points.push(arc.end);
            }
            angle_points = Calc.sortUniqueNum(angle_points);
            if (angle_points[angle_points.length - 1] - angle_points[0] < DVA_PI)
                angle_points.push(angle_points[0] + DVA_PI);
            let p1, p2, pm, newAngles;
            newAngles = [];
            if (this.ccw) {
                angle_points.reverse();
            }
            for (let p = 1; p < angle_points.length; p++) {
                p1 = angle_points[p - 1];
                p2 = angle_points[p];
                pm = p1 + (p2 - p1) / 2; // point mediana
                let arc_m = new Arc(this.x, this.y, this.radius, new Angle(pm, pm), this.ccw);
                let x = arc_m.beginX;
                let y = arc_m.beginY;

                let hit = true;
                for (let a = 0; a < this.arcs.length; a++) {
                    hit = this.arcs[a].isPointInStroke(ctx, x, y);
                    if (!hit)
                        break;
                }
                if (hit) {
                    newAngles.push(new Angle(p1, p2));
                }
            }
            this.setAngles(newAngles);
        }
    }

    clone() {
        let res = new CircleComposite(this.x, this.y, this.radius, [], this.ccw, this.id + '_clone')
        let aa = [];
        for (let i = 0; i < this.arcs.length; i++)
            aa.push(new Angle(this.arcs[i].begin, this.arcs[i].end));
        res.pushAngles(aa);
        return res;
    }
}


