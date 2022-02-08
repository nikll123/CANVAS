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

    static vectorPointPosition(x1, y1, x2, y2, x, y) {
        let a = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
        let res = LINEPNTPOS_NONE;
        if (a == 0)
            res = LINEPNTPOS_ON;
        else if (a < 0)
            res = LINEPNTPOS_LEFT;
        else
            res = LINEPNTPOS_RIGHT;
        return res;
    }

    static circlePointPosition(x1, y1, r1, x, y) {
        let d = this.getDistance(x1, y1, x, y);
        let res = CIRCLIPNTPOS_NONE;
        if (d == r1)
            res = CIRCLIPNTPOS_ON;
        else if (d < r1)
            res = LINEPNTPOS_IN;
        else
            res = LINEPNTPOS_OUT;
        return res;
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
            let AC = this.getDistance(Ax, Ay, Cx, Cy);
            CH = AC * Math.sin(CAB_angle);
            let AH = AC * Math.cos(CAB_angle);
            Hx = Ax + AH * Math.cos(XAB_angle);
            Hy = Ay + AH * Math.sin(XAB_angle);
        }
        return [CH, Hx, Hy, XAB_angle];
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
