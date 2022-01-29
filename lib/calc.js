// Different calculations 

class Calc {
    // https://cpp.mazurok.com/triangle/
    static isPointInPathTriangle(x, y, pointA, pointB, pointC) {
        let r1 = this._f2(pointA, pointB, pointC, x, y);
        let r2 = this._f2(pointB, pointC, pointA, x, y);
        let r3 = this._f2(pointC, pointA, pointB, x, y)
        let res = r1 && r2 && r3;
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

    // distance between two points
    static getDistance(x1, y1, x2, y2) {
        let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance;
    }

    // Clockwise Angle between a vector and the X axe
    static getAngle(xBeg, yBeg, xEnd, yEnd) {
        let distance = Calc.getDistance(xBeg, yBeg, xEnd, yEnd);
        let angle = Math.asin((yEnd - yBeg) / distance);
        if (xEnd > xBeg) {
            if (yEnd < yBeg)
                angle = DVA_PI + angle;
        }
        else
            angle = PI - angle;
        return angle;
    }

    // return sorted and unique values
    static sortUniqueNum(array) {
        return array.sort(function (a, b) { return a - b; }).filter(function (el, i, a) { return i === a.indexOf(el) })
    }

    static arraysEqual(a1, a2) {
        let res = a1.length == a2.length;
        if (res) {
            for (let i = 0; i < a1.length; i++) {
                res = COMPARE_TOLERANCE >= Math.abs(a1[i] - a2[i]);
                if (res == false)
                    break;
            }
        }
        return res;
    }

    static round(v, n = ROUND_DEC_DEFAULT) {
        let k = 10 ** n;
        return Math.round(v * k) / k;
    }

    // returns a couple of angles for a circle (c1) overlapping with another circle or arc(c2)
    static circleOverlap(ctx, c1, c2) {
        let crossAngle_c1 = new Angle(0, DVA_PI);
        let crossAngle_c2 = new Angle(0, DVA_PI);
        let r1 = c1.radius;
        let r2 = c2.radius;
        let distance = this.getDistance(c1.x, c1.y, c2.x, c2.y);
        let crosstype = RELATION_NONE;
        let res = [crosstype, null, null];
        if (distance > r1 + r2) {
            crosstype = RELATION_OUT;
        }
        else if (distance <= Math.abs(r1 - r2)) {
            crosstype = RELATION_IN;
        }
        else {
            let angle_base = Calc.getAngle(c1.x, c1.y, c2.x, c2.y);
            let angle_dev = Math.acos((r1 ** 2 + distance ** 2 - r2 ** 2) / (2 * r1 * distance));
            crossAngle_c1.begin = angle_base - angle_dev;
            crossAngle_c1.end = angle_base + angle_dev;
            angle_base = angle_base + PI;
            angle_dev = Math.acos((r2 ** 2 + distance ** 2 - r1 ** 2) / (2 * r2 * distance));
            crossAngle_c2.begin = angle_base - angle_dev;
            crossAngle_c2.end = angle_base + angle_dev;


            if (c2.type == 'Arc') { // check if cross points are on the arc (c2)
                let c2Path = new Path2D();
                c2Path.arc(c2.x, c2.y, c2.radius, c2.radians1, c2.radians2);
                let crossArc_c1 = new Arc(c1.x, c1.y, c1.radius, crossAngle_c1);
                let pnt1IsOn_c2 = ctx.isPointInStroke(c2Path, crossArc_c1.beginX, crossArc_c1.beginY);
                let pnt2IsOn_c2 = ctx.isPointInStroke(c2Path, crossArc_c1.endX, crossArc_c1.endY);

                if (pnt1IsOn_c2 && pnt2IsOn_c2) {
                    crosstype = RELATION_2CROSS;
                }
                else if (!pnt1IsOn_c2 && !pnt2IsOn_c2) {
                    crossAngle_c1 = null;
                    crossAngle_c2 = null;
                    let c1Path = new Path2D();
                    c1Path.arc(c1.x, c1.y, c1.radius, 0, DVA_PI);
                    let c2Inc1 = ctx.isPointInPath(c1Path, c2.beginX, c2.beginY);
                    if (c2Inc1)
                        crosstype = RELATION_IN;
                    else
                        crosstype = RELATION_OUT;
                }
                else {
                    crosstype = RELATION_1CROSS;
                    if (!pnt1IsOn_c2) {
                        crossAngle_c1.begin = crossAngle_c1.end;
                        crossAngle_c2.end = crossAngle_c2.begin;
                    }
                    if (!pnt2IsOn_c2) {
                        crossAngle_c1.end = crossAngle_c1.begin;
                        crossAngle_c2.begin = crossAngle_c2.end;
                    }
                }
            }
        }
        res = [crosstype, crossAngle_c1, crossAngle_c2];
        return res;
    }

    static altitudeTriangle(Ax, Ay, Bx, By, Cx, Cy) {
        /*        C
                 /|\
                / | \
               /  |  \
              /___|___\___ X
             A    H    B
        */
        let CH, Hx, Hy, XAB_angle;
        XAB_angle = Calc.getAngle(Ax, Ay, Bx, By);
        if (Ax == Cx && Ay == Cy) {
            CH = 0;
            Hx = Ax;
            Hy = Ay;
        }
        else {
            let XAC_angle = Calc.getAngle(Ax, Ay, Cx, Cy);
            let CAB_angle = XAC_angle - XAB_angle;
            let AC = Calc.round(this.getDistance(Ax, Ay, Cx, Cy));
            CH = Calc.round(AC * Math.sin(CAB_angle));
            let AH = Calc.round(AC * Math.cos(CAB_angle));
            Hx = Calc.round(Ax + AH * Math.cos(XAB_angle));
            Hy = Calc.round(Ay + AH * Math.sin(XAB_angle));
        }
        return [CH, Hx, Hy, XAB_angle];
    }

    // returns cross points for a arc and a line
    static crossCircleVector(ctx, ccl, vector) {
        let angleRes, x1, y1, x2, y2;
        x1 = y1 = x2 = y2 = null;
        angleRes = new Angle(ccl.arcs[0].radians1, ccl.arcs[0].radians2);
        let res = [angleRes, x1, y1, x2, y2];
        if (this.doesCircleCrossVector(ctx, ccl, vector)) {
            let h, hx, hy, angle_vector;
            [h, hx, hy, angle_vector] = this.altitudeTriangle(vector.x, vector.y, vector.x2, vector.y2, ccl.x, ccl.y);
            if (h < ccl.radius) {
                let angle_base
                if (h == 0)
                    angle_base = angle_vector + PI / 2;
                else
                    angle_base = Calc.getAngle(ccl.x, ccl.y, hx, hy);
                let a_tmp1, a_tmp2, a1;
                a1 = Math.acos(Math.abs(h) / ccl.radius);
                a_tmp1 = new Angle1(angle_base);
                a_tmp2 = new Angle1(angle_base);
                if (h <= 0)
                    a1 = - a1;
                a_tmp1.substract(a1);
                a_tmp2.add(a1);
                angleRes = new Angle(a_tmp1.value, a_tmp2.value);
                let p = vector.getPath();
                let arc1 = new Arc(ccl.x, ccl.y, ccl.radius, angleRes, ccl.ccw);
                x1 = arc1.beginX;
                y1 = arc1.beginY;
                x2 = arc1.endX;
                y2 = arc1.endY;
                let pnt1IsOnLine = ctx.isPointInStroke(p, x1, y1);
                let pnt2IsOnLine = ctx.isPointInStroke(p, x2, y2);
                if (!pnt1IsOnLine) {
                    x1 = null;
                    y1 = null;
                    angleRes.begin = angleRes.end;
                }
                if (!pnt2IsOnLine) {
                    x2 = null;
                    y2 = null;
                    angleRes.end = angleRes.begin;
                }
                res = [angleRes, x1, y1, x2, y2];
            }
        }
        return res;
    }

    // returns cross points for a circle (c) and a Outline (ol)
    static crossCircleOutLine(ctx, ccl, ol) {
        let ols = [];
        if (this.doesCircleCrossline(ctx, ccl, ol)) {
            let angles = [];
            let crossAngle = null;
            for (let i = 0; i < ol.lines.length; i++) {
                const l = ol.lines[i];
                if (l.type == 'Vector')
                    ({ crossAngle, i } = Calc._checkVector(ctx, ccl, l, crossAngle, ol, i));
                else if (l.type == 'Arc')
                    ({ crossAngle, i } = Calc._checkArc(ctx, ccl, l, crossAngle, ol, i));
                if (crossAngle != null && crossAngle.value != 0) {
                    angles.push(crossAngle);
                    crossAngle = null;
                }
            }
            if (angles.length == 2 && angles[0].value == 0 && angles[1].value == 0) {
                angles = [new Angle(angles[0].begin, angles[1].end)];
            }
            ccl.setAngles(angles);
            if (angles.length > 1)
                ccl.mergeArcs();
            ols = this.composeResOl(ccl, ol);
        }
        return ols;
    }

    static _checkArc(ctx, ccl, arc, crossAngle, ol, i) {
        let ang1, ang2, crosstype, a1;
        [crosstype, ang1, ang2] = this.circleOverlap(ctx, ccl, arc);

        if (crosstype == RELATION_OUT)
            ;
        else if (crosstype == RELATION_IN) {
            ol.lines.splice(i, 1);
            i--;
        }
        else if (crosstype == RELATION_1CROSS) {
            if (crossAngle == null)
                crossAngle = ang1;
            else if (crossAngle.value == 0 && ang1.value == 0)
                crossAngle.end = ang1.end;
            else
                console.assert(false);
            if (ccl.isPointInPath(ctx, arc.beginX, arc.beginY))
                a1 = new Angle(ang2.begin, arc.radians2);
            else if (ccl.isPointInPath(ctx, arc.endX, arc.endY))
                a1 = new Angle(arc.radians1, ang2.begin);
            let arc1 = new Arc(arc.x, arc.y, arc.radius, a1, arc.ccw);
            ol.lines.splice(i, 1, arc1);
        }
        else if (crosstype == RELATION_2CROSS) {
            a1 = new Angle(arc.radians1, ang2.begin);
            let arc1 = new Arc(arc.x, arc.y, arc.radius, a1, arc.ccw);
            a1 = new Angle(ang1.begin, ang1.end);
            if (ccl.ccw)
                a1.reverse();
            let arc2 = new Arc(ccl.x, ccl.y, ccl.radius, a1, ccl.ccw);
            a1 = new Angle(ang2.end, arc.radians2);
            if (arc.ccw)
                a1.reverse();
            let arc3 = new Arc(arc.x, arc.y, arc.radius, a1, arc.ccw);
            ol.lines.splice(i, 1, arc1);
            ol.lines.splice(i, 0, arc2);
            ol.lines.splice(i, 0, arc3);
            i = i + 2;
        }
        return { crossAngle, i };
    }

    static _checkVector(ctx, ccl, l, crossAngle, ol, i) {
        if (this.doesCircleCrossVector(ctx, ccl, l)) {
            let ang1, x1, y1, x2, y2;
            [ang1, x1, y1, x2, y2] = this.crossCircleVector(ctx, ccl, l);
            if (crossAngle == null)
                crossAngle = ang1;
            else if (crossAngle.value == 0 && ang1.value == 0)
                crossAngle.end = ang1.end;
            else
                console.assert(false);
            let new_l = [];
            if (x1 != null || x2 != null) {
                if (x1 != null)
                    new_l.push(new Vector(l.x, l.y, x1, y1));
                if (x2 != null)
                    new_l.push(new Vector(x2, y2, l.x2, l.y2));
                ol.lines.splice(i, 1);
                for (let j = new_l.length - 1; j > -1; j--)
                    ol.lines.splice(i, 0, new_l[j]);
                i = i + new_l.length - 1;
            }
        }
        return { crossAngle, i };
    }

    // works with lines like OutLine, Vectors...
    static doesCircleCrossline(ctx, c, line) {
        let p = line.getPath();
        return this._doesCircleCrossline(ctx, p, c);
    }

    static doesCircleCrossVector(ctx, c, vector) {
        let p = new Path2D;
        p.moveTo(vector.beginX, vector.beginY);
        p.lineTo(vector.endX, vector.endY);
        p.lineTo(vector.beginX, vector.beginY);
        p.lineTo(vector.endX, vector.endY);
        return this._doesCircleCrossline(ctx, p, c);
    }

    static _doesCircleCrossline(ctx, p, c) {
        ctx.save();
        ctx.lineWidth = c.radius * 2;
        ctx.lineJoin = 'round';
        let res = ctx.isPointInStroke(p, c.x, c.y);
        ctx.strokeStyle = DRAFT_COLOR;
        ctx.globalAlpha = 0.1;
        // ctx.stroke(p);
        ctx.restore();
        return res;
    }

    // returns a new OutLine (ol1) after cutoff by another Outline (ol2)
    static crossOutLineOutLine(ol1, ol2) {
        let angles = [];
        for (let i = 0; i < ol1.lines.length; i++) {
            let l1 = ol1.lines[i];
            for (let j = 0; j < ol2.lines.length; j++) {
                let l2 = ol2.lines[j];
                if (l1.type == 'Arc' && l2.type == 'VectorComposite') {
                    let ret = this.crossCircleVector(ctx, l1, l2);
                    if (ret.length > 0) {
                        angles.push(ret[0]);
                        angles.push(ret[1]);
                    }
                }
                else if (l1.type == 'Arc' && l2.type == 'Arc') {
                    let ret = this.circleOverlap(ol1, l1);
                    console.assert(false);
                    if (ret[0].begin == 0 && ret[0].end == DVA_PI && ret[1].begin == DVA_PI && ret[1].end == DVA_PI) {
                        // skip  irrelevant results
                    }
                    else {
                        angles.push(ret[0]);
                        angles.push(ret[1]);
                    }
                }
            }
        }
        if (angles.length == 4) {
            if (angles[0].end == angles[1].begin && angles[2].end == angles[3].begin) {
                let amin = Math.min(angles[0].end, angles[2].end);
                let amax = Math.max(angles[0].end, angles[2].end);
                angles = [new Angle(amin, amax)];
            }
        }
        return [ol1];
    }

    static composeResOl(ccl, ol) {
        if (ccl.type == 'CircleComposite')
            for (let i = 0; i < ccl.arcs.length; i++) {
                const arc = ccl.arcs[i];
                ol.push(arc);
            }
        let ol1;
        let resOl = [];
        let initNewOl = true;
        while (ol.lines.length > 0) {
            let originLength = ol.lines.length;
            if (initNewOl) {
                ol1 = new Outline([], 'resultOl');
                resOl.push(ol1);
                ol1.push(ol.lines[0]);
                ol.lines[0] = undefined;
                ol.lines.splice(0, 1);
            }
            let lineLast = ol1.lines[ol1.lines.length - 1];
            for (let i = 0; i < ol.lines.length; i++) {
                let lineTry = ol.lines[i];
                if (lineTry != undefined) {
                    if (lineLast.endX == lineTry.beginX && lineLast.endY == lineTry.beginY) {
                        ol1.push(lineTry);
                        ol.lines[i] = undefined;
                        break;
                    }
                }
            }
            this.removeUndefined(ol.lines);
            initNewOl = (originLength == ol.lines.length);
        }
        return resOl;
    }

    static removeUndefined(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] == undefined)
                array.splice(i, 1);
        }
    }

    static angleNormalize(value) {
        let a = value;
        if (a != 0) {
            let cnt = Math.sign(a) * Math.floor(Math.abs(a) / DVA_PI);
            if (cnt != 0)
                a = a - cnt * DVA_PI;
            if (a < 0)
                a = DVA_PI + a;
        }
        return a;
    }
}



