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
    static sortAndUnique(array) {
        return array.sort().filter(function (el, i, a) { return i === a.indexOf(el) })
    }

    static arraysEqual(a1, a2) {
        let res = a1.length == a2.length;
        if (res) {
            for (let i = 0; i<a1.length; i++) {
                res = a1[i] == a2[i];
                if (res == false)
                    break;
            }
        }
        return res;
    }

    static round(v, n=2)
    {
        let k = 10 **n;
        return Math.round(v * k) / k;
    }

    // calculates a couple of angles of a circle free of overlapping with another circle
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
            let c1rQ = c1.radius ** 2;
            let c2rQ = c2.radius ** 2;
            let dQ = distance ** 2;
            let k = 2 * distance;

            let angle_base1 = Calc.getAngle(c1.x, c1.y, c2.x, c2.y);
            let angleC1_dev = Math.acos((c1rQ + dQ - c2rQ) / (c1.radius * k));
            let a_begin = angle_base1 - angleC1_dev;
            let a_end = angle_base1 + angleC1_dev;
            if (a_begin > 0) {
                angle1.end = a_begin;
                if (a_end <= DVA_PI)
                    angle2.begin = a_end;
                else
                    angle1.begin = a_end - DVA_PI;
            }
            if (a_begin < 0) {
                angle1.begin = a_end;
                angle1.end = DVA_PI + a_begin;
            }
        }
        return [angle1, angle2];
    }
}
