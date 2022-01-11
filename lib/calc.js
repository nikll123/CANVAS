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
        let distance = this.getDistance(c1.x, c1.y, c2.x, c2.y);
        let angle1 = new Angle(0, DVA_PI);
        let angle2 = new Angle(DVA_PI, DVA_PI);
        if (distance > c1.radius + c2.radius) {
            // do nothing, separated circles
        }
        else if (distance <= Math.abs(c1.radius - c2.radius)) {
            if (c1.radius < c2.radius)
                angle1.end = 0;
        }
        else {
            // angle_d = Math.acos((r1 ** 2 + r2 ** 2 - distance ** 2) / (2 * r1 * r2));
            let r1Q = c1.radius ** 2;
            let r2Q = c2.radius ** 2;
            let dQ = distance ** 2;
            let k = 2 * distance;

            let angle_base = Calc.getAngle(c1.x, c1.y, c2.x, c2.y);
            let angle_dev = Math.acos((r1Q + dQ - r2Q) / (c1.radius * k));
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
        }
        return [angle1, angle2];
    }

    // returns cross points for a circle (c1) and a line (l)
    static crossCircleLine(c, l) {
        let angle1 = new Angle(0, DVA_PI);
        let angle2 = new Angle(DVA_PI, DVA_PI);
        let a_tmp = Calc.getAngle(l.x, l.y, c.x, c.y);
        let angle_l = Calc.getAngle(l.x, l.y, l.x2, l.y2)
        let a1 = Math.abs(angle_l - a_tmp);
        let distance = this.getDistance(l.x, l.y, c.x, c.y);
        let h = distance * Math.sin(a1);
        if (h >= c.radius) {
            // no crossing
        }
        else {
            let angle_base = angle_l + PI / 2;
            a1 = Math.acos(h / c.radius);
            angle1.end = angle_base - a1;
            angle2.begin = angle_base + a1;
        }
        return [angle1, angle2];
    }

}

