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

    static lineOwnsPoint(l, x, y) {
        let minX = Math.min(l.x, l.x2);
        let maxX = Math.max(l.x, l.x2);
        let minY = Math.min(l.y, l.y2);
        let maxY = Math.max(l.y, l.y2);
        return ((minX <= x && x <= maxX) && (minY <= y && y <= maxY));
    }

    // returns a couple of angles for a circle (c1) overlapping with another circle (c2)
    static circleOverlap(c1, c2) {
        let angle1 = new Angle(0, DVA_PI);
        let angle2 = new Angle(DVA_PI, DVA_PI);
        let r1 = c1.radius;
        let r2 = c2.radius;
        let distance = this.getDistance(c1.x, c1.y, c2.x, c2.y);
        if (distance > r1 + r2) {
            // do nothing, separated circles
        }
        else if (distance <= Math.abs(r1 - r2)) {
            if (r1 < r2)
                angle1.end = 0;
        }
        else {
            let r1Q = r1 ** 2;
            let r2Q = r2 ** 2;
            let dQ = distance ** 2;

            let angle_base = Calc.getAngle(c1.x, c1.y, c2.x, c2.y);
            let angle_dev = Math.acos((r1Q + dQ - r2Q) / (2 * r1 * distance));
            let a_begin = angle_base - angle_dev;
            let a_end = angle_base + angle_dev;
            if (a_begin >= 0) {
                angle1.end = a_begin;
                if (a_end <= DVA_PI)
                    angle2.begin = a_end;
                else
                    angle1.begin = a_end - DVA_PI;
            }
            else {
                angle1.begin = a_end;
                angle1.end = DVA_PI + a_begin;
            }

            if (c2.type == 'Arc') { // check if cross points are on the arc (c2)
                let a1 = new Angle(0, angle_base);
                a1.add(PI);
                angle_base = a1.end;
                angle_dev = Math.acos((r2Q + dQ - r1Q) / (2 * r2 * distance));
                a_begin = Calc.round(angle_base - angle_dev);
                a_end = Calc.round(angle_base + angle_dev);
                let c2_begin = c2.radians2;
                let c2_end = c2.radians1;
                if (c2_begin <= a_begin && a_begin <= c2_end) {
                    if (c2_begin <= a_end && a_end <= c2_end) {
                        // do nothing, both points are ON the arc
                    }
                    else {   // begin is ON and end is OUT of the arc
                        angle1.begin = 0;
                        angle1.end = angle2.begin;
                        angle2.end = DVA_PI;
                    }
                }
                else {   // begin is OUT and end is ON the arc
                    if (c2_begin <= a_end && a_end <= c2_end) {
                        angle1.begin = 0;
                        angle2.begin = angle1.end;
                        angle2.end = DVA_PI;
                    }
                    else {  // both points are OUT of the arc
                        angle1.begin = 0;
                        angle1.end = DVA_PI;
                        angle2.begin = DVA_PI;
                        angle2.end = DVA_PI;
                    }
                }
            }
        }
        return [angle1, angle2];
    }


    // returns cross points for a circle (c1) and a line (l)
    static crossCircleLine(c, l) {
        let angle1 = new Angle(0, DVA_PI);
        let angle2 = new Angle(DVA_PI, DVA_PI);
        let a_tmp = Calc.getAngle(l.x, l.y, c.x, c.y);
        let angle_l = Calc.getAngle(l.x, l.y, l.x2, l.y2);
        let a1 = Math.abs(angle_l - a_tmp);
        let distance = Calc.round(this.getDistance(l.x, l.y, c.x, c.y));
        let h = Calc.round(distance * Math.sin(a1));
        let res = [];

        if (h >= c.radius) {
            // no crossing
        }
        else {

            let cath = Calc.round(distance * Math.cos(a1));
            let hy = Calc.round(l.y + cath * Math.sin(angle_l));
            let hx = Calc.round(l.x + cath * Math.cos(angle_l));

            let v1 = new Vector(c.x, c.y, hx, hy);
            v1.azimuth;

            let angle_base = Calc.getAngle(c.x, c.y, hx, hy);
            a1 = Math.acos(h / c.radius);
            let a_tmp1 = new Angle(0, angle_base);
            a_tmp1.substract(a1);
            let a_tmp2 = new Angle(0, angle_base);
            a_tmp2.add(a1);
            let arc1 = new Arc(c.x, c.y, c.radius, a_tmp1);
            let arc2 = new Arc(c.x, c.y, c.radius, a_tmp2);

            let pnt1IsOnLine = Calc.lineOwnsPoint(l, arc1.endX, arc1.endY);
            let pnt2IsOnLine = Calc.lineOwnsPoint(l, arc2.endX, arc2.endY);

            if (pnt1IsOnLine || pnt2IsOnLine) {
                if (pnt1IsOnLine && pnt2IsOnLine) {
                    angle1.end = Math.min(a_tmp1.value, a_tmp2.value);
                    angle2.begin = Math.max(a_tmp1.value, a_tmp2.value);
                }
                else if (pnt1IsOnLine) {
                    angle1.end = a_tmp1.value;
                    angle2.begin = a_tmp1.value;
                }
                else {
                    angle1.end = a_tmp2.value;
                    angle2.begin = a_tmp2.value;
                }
                res = [angle1, angle2];
            }
        }
        return res;
    }

    // returns cross points for a circle (c1) and a Outline (ol)
    static crossCircleOutLine(c, ol) {
        let angles = [];
        for (let i = 0; i < ol.lines.length; i++) {
            let l = ol.lines[i];
            if (l.type == 'Vector') {
                let ret = this.crossCircleLine(c, l);
                if (ret.length > 0) {
                    angles.push(ret[0]);
                    angles.push(ret[1]);
                }
            }
            else if (l.type == 'Arc') {
                let ret = this.circleOverlap(c, l);
                if (ret[0].begin == 0 && ret[0].end == DVA_PI && ret[1].begin == DVA_PI && ret[1].end == DVA_PI) {
                    // skip  irrelevant results
                }
                else {
                    angles.push(ret[0]);
                    angles.push(ret[1]);
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
        return angles;
    }
}

