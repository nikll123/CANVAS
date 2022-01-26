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

    // returns a couple of angles for a circle (c1) overlapping with another circle (c2)
    static circleOverlap(c1, c2) {
        let angle1 = new Angle(0, DVA_PI);
        let r1 = c1.radius;
        let r2 = c2.radius;
        let distance = this.getDistance(c1.x, c1.y, c2.x, c2.y);
        let res = [];
        if (distance > r1 + r2) {
            // do nothing, separated circles
        }
        else if (distance <= Math.abs(r1 - r2)) {
            // if (r1 < r2) {
            //     angle1 = new Angle(0, DVA_PI);
            //     res.push(angle1);
            // }
        }
        else {
            let r1Q = r1 ** 2;
            let r2Q = r2 ** 2;
            let dQ = distance ** 2;

            let angle_base = Calc.getAngle(c1.x, c1.y, c2.x, c2.y);
            let angle_dev = Math.acos((r1Q + dQ - r2Q) / (2 * r1 * distance));
            angle1.begin = angle_base - angle_dev;
            angle1.end = angle_base + angle_dev;

            if (c2.type == 'Arc') { // check if cross points are on the arc (c2)
                let p = new Path2D();
                p.arc(c2.x, c2.y, c2.radius, c2.radians1, c2.radians2);
                let arc1 = new Arc(c1.x, c1.y, c1.radius, angle1);
                let pnt1IsOnLine = ctx.isPointInStroke(p, arc1.beginX, arc1.beginY);
                let pnt2IsOnLine = ctx.isPointInStroke(p, arc1.endX, arc1.endY);

                if (pnt1IsOnLine || pnt2IsOnLine) {
                    if (pnt1IsOnLine)
                        angle1.end = angle1.begin + DVA_PI;
                    else if (pnt2IsOnLine)
                        angle1.begin = angle1.end - DVA_PI;
                    res.push(angle1);
                }
            }
        }
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
        let angle1, x1, y1, x2, y2;
        angle1 = new Angle(ccl.arcs[0].radians1, ccl.arcs[0].radians2);
        let res = [angle1, x1, y1, x2, y2];
        if (this.doesCircleCrossVector(ctx, ccl, vector)) {
            let angle_base, h, hx, hy, angle_vector;
            [h, hx, hy, angle_vector] = this.altitudeTriangle(vector.x, vector.y, vector.x2, vector.y2, ccl.x, ccl.y);
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
                angle1 = new Angle(a_tmp1.value, a_tmp2.value);
                let p = vector.getPath();
                let arc1 = new Arc(ccl.x, ccl.y, ccl.radius, angle1, ccl.ccw);
                x1 = arc1.beginX;
                y1 = arc1.beginY;
                x2 = arc1.endX;
                y2 = arc1.endY;
                let pnt1IsOnLine = ctx.isPointInStroke(p, x1, y1);
                let pnt2IsOnLine = ctx.isPointInStroke(p, x2, y2);

                if (pnt1IsOnLine || pnt2IsOnLine) {
                    if (pnt1IsOnLine && pnt2IsOnLine)
                        ;// do nothing
                    else {
                        if (pnt1IsOnLine) {
                            x2 = undefined;
                            y2 = undefined;
                        }
                        else {
                            x1 = undefined;
                            y1 = undefined;
                        }
                    }
                }
                res = [angle1, x1, y1, x2, y2];
        }
        return res;
    }

    // returns cross points for a circle (c) and a Outline (ol)
    static crossCircleOutLine(ccl, ol) {
        if (this.doesCircleCrossline(ctx, ccl, ol)) {
            let angles = [];
            for (let i = 0; i < ol.lines.length; i++) {
                const l = ol.lines[i];
                let res = [];
                if (l.type == 'Vector') {
                    if (this.doesCircleCrossVector(ctx, ccl, l)) {
                        let angle1, x1, y1, x2, y2;
                        [angle1, x1, y1, x2, y2] = this.crossCircleVector(ctx, ccl, l);
                        if (angle1 != undefined) {
                            angles.push(angle1);
                            let new_l = [];
                            if (x1 != undefined)
                                new_l.push(new Vector(l.x, l.y, x1, y1));
                            if (x2 != undefined) {
                                new_l.push(new Vector(x2, y2, l.x2, l.y2));
                            }
                            ol.lines.splice(i, 1);
                            for (let j = new_l.length - 1; j > -1; j--) {
                                ol.lines.splice(i, 0, new_l[j]);
                            }
                            i = i + new_l.length - 1;
                        }
                    }
                }
                else if (l.type == 'Arc')
                    res = [];
            }
            ccl.setAngles(angles);
            if (angles.length > 1)
                ccl.mergeArcs();
            [ccl, ol] = this.composeResOl(ccl, ol);
        }
        return [ccl, ol];
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
        ctx.lineWidth = c.radius * 2 - 2;
        ctx.lineJoin = 'round';
        let res = ctx.isPointInStroke(p, c.x, c.y);
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
        let resOl = new Outline([], 'resultOl');
        if (ol.lines.length > 0) {
            resOl.push(ol.lines[0]);
            ol.lines[0] = undefined;
            for (let i = 1; i < ol.lines.length; i++) {
                if (ol.lines[i] != undefined) {
                    let line1 = resOl.lines[resOl.lines.length - 1];
                    let line2 = ol.lines[i];
                    if (line1.endX == line2.beginX && line1.endY == line2.beginY) {
                        resOl.push(line2);
                        ol.lines[i] = undefined;
                    }
                    else {
                        for (let j = 0; j < ccl.arcs.length; j++) {
                            if (ccl.arcs[j] != undefined) {
                                let arc1 = ccl.arcs[j];
                                if (arc1.beginX == line1.endX && arc1.beginY == line1.endY) {
                                    resOl.push(arc1);
                                    ccl.arcs[j] = undefined;
                                    i--; // decrease to avoid line skip 
                                    break;
                                }
                            }
                        }
                        for (let i = ccl.arcs.length - 1; i >= 0; i--) {
                            if (ccl.arcs[i] == undefined)
                                ccl.arcs.splice(i, 1);
                        }
                    }
                }
            }
        }
        return [ccl, resOl];
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



