// Different calculations 

class Calc {
    // https://cpp.mazurok.com/triangle/
    static isPointInsideTriangle(x, y, pointA, pointB, pointC) {
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

    static altitudeTriangle(x1, y1, x2, y2, hx1, hy1) {
        let a_v1_c = Calc.getAngle(x1, y1, hx1, hy1);
        let angle_vector = Calc.getAngle(x1, y1, x2, y2);
        let a1 = Math.abs(angle_vector - a_v1_c);
        let distance = Calc.round(this.getDistance(x1, y1, hx1, hy1));
        let h = Calc.round(distance * Math.sin(a1));
        let cath = Calc.round(distance * Math.cos(a1));
        let hx2 = Calc.round(x1 + cath * Math.cos(angle_vector));
        let hy2 = Calc.round(y1 + cath * Math.sin(angle_vector));
        return [h, hx2, hy2, angle_vector];
    }

    // returns cross points for a arc and a line
    static crossCircleVector(ctx, arc, vector, centreInPath) {
        let res = [];
        if (this.doesCircleCrossline(ctx, arc, vector)) {
            let angle1, angle_base, h, hx, hy, angle_vector;
            [h, hx, hy, angle_vector] = this.altitudeTriangle(vector.x, vector.y, vector.x2, vector.y2, arc.x, arc.y);
            if (arc.x == hx && arc.y == hy) {
                angle1 = new Angle(angle_vector, angle_vector + PI);
                centreInPath = !centreInPath
            }
            else {
                angle_base = Calc.getAngle(arc.x, arc.y, hx, hy);
                let a_tmp1, a_tmp2, a1;
                a1 = Math.acos(Math.abs(h) / arc.radius);
                a_tmp1 = new Angle1(angle_base);
                a_tmp2 = new Angle1(angle_base);
                a_tmp1.substract(a1);
                a_tmp2.add(a1);
                angle1 = new Angle(a_tmp1.value, a_tmp2.value);
            }
            let p = new Path2D();
            p.moveTo(vector.x, vector.y);
            p.lineTo(vector.x2, vector.y2);
            let arc1 = new Arc(arc.x, arc.y, arc.radius, angle1);
            let pnt1IsOnLine = ctx.isPointInStroke(p, arc1.beginX, arc1.beginY);
            let pnt2IsOnLine = ctx.isPointInStroke(p, arc1.endX, arc1.endY);

            if (pnt1IsOnLine || pnt2IsOnLine) {
                if (pnt1IsOnLine && pnt2IsOnLine)
                    ;// do nothing
                else if (pnt1IsOnLine)
                    angle1.end = angle1.begin + DVA_PI;
                else if (pnt2IsOnLine)
                    angle1.begin = angle1.end - DVA_PI;
            }
            if (!centreInPath)
                angle1.reverse();
            res = [angle1];

        }
        return res;
    }

    // returns cross points for a circle (c1) and a Outline (ol)
    static crossCircleOutLine(c, ol, centreInPath) {
        let angles = [];
        if (this.doesCircleCrossline(ctx, c, ol)) {
            for (let i = 0; i < ol.lines.length; i++) {
                const l = ol.lines[i];
                let res = [];
                if (l.type == 'Vector') {
                    if (this.doesCircleCrossline(ctx, c, l))
                        res = this.crossCircleVector(ctx, c, l, centreInPath);
                }
                else if (l.type == 'Arc') {
                    res = this.circleOverlap(c, l);
                }
                for (let i = 0; i < res.length; i++) {
                    angles.push(res[i]);
                }
            }
            if (angles.length == 0)
                angles.push(new Angle(0, DVA_PI));
            else if (angles.length == 2) {
                if (angles[0].isDVA_PI && angles[1].isDVA_PI) {
                    angles = [new Angle(angles[0].rayBegin.value, angles[1].rayEnd.value)];
                }
            }
        }
        else
            angles.push(new Angle(0, DVA_PI));
        return angles;
    }

    // works with lines like OutLine, Vectors...
    static doesCircleCrossline(ctx, c, line) {
        let p = line.getPath();
        ctx.save();
        ctx.lineWidth = c.radius * 2;
        ctx.lineJoin = 'round';
        let res = ctx.isPointInStroke(p, c.x, c.y);
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

    // static getPath(ol) {
    //     let path = new Path2D();
    //     for (let i = 0; i < ol.lines.length; i++) {
    //         let l = ol.lines[i];
    //         if (i == 0)
    //             l.moveToStart(path);
    //         if (l.type == 'Vector')
    //             path.lineTo(l.x2, l.y2);
    //         else if (l.type == 'Arc')
    //             path.arc(l.x, l.y, l.radius, l.radians1, l.radians2, l.ccw);
    //     }
    //     return path;
    // }

    olOver
}



