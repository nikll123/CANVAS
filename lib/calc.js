// Different calculations 

class Calc {
    // https://cpp.mazurok.com/triangle/
    static isPointInsideTriangle(x, y, pointA, pointB, pointC) {
        var r1 = this._f2(pointA, pointB, pointC, x, y);
        var r2 = this._f2(pointB, pointC, pointA, x, y);
        var r3 = this._f2(pointC, pointA, pointB, x, y)
        var res = r1 && r2 && r3;
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
        var distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance;
    }

    // Clockwise Angle between a vector and the X axe
    static getAngle(xBeg, yBeg, xEnd, yEnd) {
        var distance = Calc.getDistance(xBeg, yBeg, xEnd, yEnd);
        var angle = Math.asin((yEnd - yBeg) / distance);
        if (xEnd > xBeg) {
            if (yEnd < yBeg)
                angle = DVA_PI + angle;
        }
        else
            angle = PI - angle;
        return angle;
    }

    // calculates a couple of angles of a circle free of overlapping with another circle
    static circleOverlap(c1, c2) {
        var distance = this.getDistance(c1.x, c1.y, c2.x, c2.y);
        var angleC1_1 = new Angle(0, DVA_PI);
        var angleC1_2 = new Angle(DVA_PI, DVA_PI);
        var angleC2_1 = new Angle(0, DVA_PI);
        var angleC2_2 = new Angle(DVA_PI, DVA_PI);
        if (distance > c1.radius + c2.radius) {
            // do nothing
        }
        else if (distance < Math.abs(c1.radius - c2.radius)) {
            if (c1.radius > c2.radius)
                angleC2_1.end = 0;
            else
                angleC1_1.end = 0;
        }
        else {
            // angle_d = Math.acos((r1 ** 2 + r2 ** 2 - distance ** 2) / (2 * r1 * r2));
            var c1rQ = c1.radius ** 2;
            var c2rQ = c2.radius ** 2;
            var dQ = distance ** 2;
            var k = 2 * distance;

            var angle_base1 = Calc.getAngle(c1.x, c1.y, c2.x, c2.y);
            var angleC1_dev = Math.acos((c1rQ + dQ - c2rQ) / (c1.radius * k));
            var a_begin = angle_base1 - angleC1_dev;
            var a_end = angle_base1 + angleC1_dev;
            if (a_begin > 0) {
                angleC1_1.end = a_begin;
                if (a_end <= DVA_PI)
                    angleC1_2.begin = a_end;
                else
                    angleC1_1.begin = a_end - DVA_PI;
            }
            if (a_begin < 0) {
                angleC1_1.begin = a_end;
                angleC1_1.end = DVA_PI + a_begin;
            }
            if (debugRender) {
                angleC1_1.render(ctx, c1.x, c1.y, c1.radius, '#0000FF');
                angleC1_2.render(ctx, c1.x, c1.y, c1.radius, '#FF0000');
            }
        }
        return [angleC1_1, angleC1_2];
    }
}
