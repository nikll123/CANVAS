// Different calculations 

class CalcCross {

    // returns a couple of angles for a circle (c1) overlapping with another circle or arc(c2)
    static circleOverlap(ctx, c1, c2) {
        let crossAngle_c1 = ANGLE_DVA_PI;
        let crossAngle_c2 = ANGLE_DVA_PI;
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
            crossAngle_c1.normalize();
            angle_base = Calc.angleNormalize(angle_base + PI);
            angle_dev = Math.acos((r2 ** 2 + distance ** 2 - r1 ** 2) / (2 * r2 * distance));
            crossAngle_c2.begin = angle_base - angle_dev;
            crossAngle_c2.end = angle_base + angle_dev;
            crossAngle_c2.normalize();
            if (c1.radius > distance)
                crossAngle_c2.reverse();

            if (c2.type == 'Arc') { // check if cross points are on the arc (c2)
                let c2_path = new Path2D();
                c2_path.arc(c2.x, c2.y, c2.radius, c2.radians1, c2.radians2);
                let c1_crossArc = new Arc(c1.x, c1.y, c1.radius, crossAngle_c1);
                let c1_begIsOn = ctx.isPointInStroke(c2_path, c1_crossArc.beginX, c1_crossArc.beginY);
                let c1_endIsOn = ctx.isPointInStroke(c2_path, c1_crossArc.endX, c1_crossArc.endY);

                if (c1_begIsOn && c1_endIsOn) {
                    crosstype = RELATION_2CROSS;
                }
                else if (!c1_begIsOn && !c1_endIsOn) {
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
                    let c2_crossArc = new Arc(c2.x, c2.y, c2.radius, crossAngle_c2);
                    let c2_begIsOn = ctx.isPointInStroke(c2_path, c2_crossArc.beginX, c2_crossArc.beginY);
                    // let c2_endIsOn = ctx.isPointInStroke(c2_path, c2_crossArc.endX, c2_crossArc.endY);

                    if (c1_begIsOn)
                        crossAngle_c1.end = crossAngle_c1.begin;
                    else // (c1_endIsOn)
                        crossAngle_c1.begin = crossAngle_c1.end;
                    if (c2_begIsOn)
                        crossAngle_c2.end = crossAngle_c2.begin;
                    else // (c2_endIsOn)
                        crossAngle_c2.begin = crossAngle_c2.end;
                }
            }
        }
        res = [crosstype, crossAngle_c1, crossAngle_c2];
        return res;
    }

    // returns cross points for a arc and a line
    static crossCircleVector(ctx, ccl, vector) {
        let angleRes, x1, y1, x2, y2, res;
        x1 = y1 = x2 = y2 = null;
        let relType = RELATION_NONE;
        let cclRes = ccl.clone();
        // let vecRes = new VectorComposite();
        angleRes = new Angle(ccl.arcs[0].radians1, ccl.arcs[0].radians2);
        if (this.doesCircleCrossVector(ctx, ccl, vector)) {
            let h, hx, hy, angle_vector;
            [h, hx, hy, angle_vector] = Calc.altitudeTriangle(vector.x, vector.y, vector.x2, vector.y2, ccl.x, ccl.y);
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
                if (pnt1IsOnLine && pnt2IsOnLine)
                    relType = RELATION_2CROSS;
                else if (pnt1IsOnLine || pnt2IsOnLine) {
                    relType = RELATION_1CROSS;
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
                }
            }
            else if (h == ccl.radius) {
                relType = RELATION_CONTACT;
                angleRes.begin = Calc.getAngle(ccl.x, ccl.y, hx, hy);
                angleRes.end = angleRes.begin;
                x1 = x2 = hx;
                y1 = y2 = hy;
            }
            res = [relType, angleRes, x1, y1, x2, y2];
        }

        res = [relType, cclRes, x1, y1, x2, y2];
        return res;
    }

    // returns cross points for a circle (c) and a Outline (ol)
    static crossCircleOutLine(ctx, ccl, ol) {
        let ols = [];
        if (this.doesCircleCrossline(ctx, ccl, ol)) {
            let angles = [];
            let crossAngle = null;
            let crossAngleBeg = null;
            let crossAngleEnd = null;
            for (let i = 0; i < ol.lines.length; i++) {
                const l = ol.lines[i];
                if (l.type == 'Vector')
                    ({ crossAngle, i } = this._checkVector(ctx, ccl, l, crossAngle, ol, i));
                else if (l.type == 'Arc')
                    ({ crossAngle, i } = this._checkArc(ctx, ccl, l, crossAngle, ol, i));
                if (crossAngle != null)
                    if (crossAngle.value != 0) {
                        angles.push(crossAngle);
                        crossAngle = null;
                    }
                    else {
                        if (crossAngleBeg == null && crossAngleEnd == null)
                            crossAngleBeg = crossAngle.begin;
                        else if (crossAngleBeg != null && crossAngleEnd == null) {
                            crossAngleEnd = crossAngle.begin;
                            crossAngle = new Angle(crossAngleBeg, crossAngleEnd);
                            angles.push(crossAngle);
                            // let a = new Arc(ccl.x, ccl.y, ccl.radius, crossAngle, ccl.ccw);
                            // ol.lines.splice(i, 0, a);
                            crossAngle = null;
                            crossAngleBeg = null;
                            crossAngleEnd = null;
                        }
                    }
            }
            if (angles.length == 0)
                angles = [new Angle(0, DVA_PI)];
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
            crossAngle = null;
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

            let b1 = ccl.isPointInPath(ctx, arc.beginX, arc.beginY);
            let b2 = ccl.isPointInPath(ctx, arc.endX, arc.endY)
            if (b1)
                a1 = new Angle(ang2.begin, arc.radians2);
            else if (b2)
                a1 = new Angle(arc.radians1, ang2.begin);
            else
                console.assert(false);

            let arc1 = new Arc(arc.x, arc.y, arc.radius, a1, arc.ccw);
            ol.lines.splice(i, 1, arc1);
        }
        else if (crosstype == RELATION_2CROSS) {
            crossAngle = ang1;
            let arcCcl = _getArc(ccl, crossAngle.begin, crossAngle.end);
            let intExt = ccl.isPointInPath(ctx, arc.beginX, arc.beginY);
            if (intExt) {
                let arc1 = _getArc(arc, ang2.begin, ang2.end);
                ol.lines.splice(i, 1, arc1);
                i++;
                ol.lines.splice(i, 0, arcCcl);
            }
            else {
                let arc1 = _getArc(arc, arc.radians1, ang2.begin);
                let arc3 = _getArc(arc, ang2.end, arc.radians2);
                ol.lines.splice(i, 1, arc1);
                // i++;
                // ol.lines.splice(i, 0, arcCcl);
                i++;
                ol.lines.splice(i, 0, arc3);
            }
            if (ccl.ccw) {
                crossAngle.reverse();
            }
        }
        return { crossAngle, i };

        function _getArc(arc, a_beg, a_end) {
            a1 = new Angle(a_beg, a_end);
            if (arc.ccw)
                a1.reverse();
            let arc2 = new Arc(arc.x, arc.y, arc.radius, a1, arc.ccw);
            return arc2;
        }
    }

    static _checkVector(ctx, ccl, l, crossAngle, ol, i) {
        if (this.doesCircleCrossVector(ctx, ccl, l)) {
            let ang1, x1, y1, x2, y2, relType;
            [relType, ang1, x1, y1, x2, y2] = this.crossCircleVector(ctx, ccl, l);
            if (relType == RELATION_1CROSS || relType == RELATION_2CROSS) {
                if (crossAngle == null)
                    crossAngle = ang1;
                else if (crossAngle.value == 0 && ang1.value == 0)
                    crossAngle.end = ang1.end;
                else
                    console.assert(false);
                crossAngle.normalize();
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
            else if (relType == RELATION_CONTACT) {

                ;
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
            Calc.removeUndefined(ol.lines);
            initNewOl = (originLength == ol.lines.length);
        }
        return resOl;
    }

}
