// Different calculations 

class CalcCross {

    // returns a couple of angles for a circle (c1) overlapping with another circle or arc(c2)
    static arcCross(ctx, arc1, arc2) {
        console.assert(arc1.angle.angleType == ANGLETYPE_NORMAL || arc1.angle.angleType == ANGLETYPE_DVA_PI)
        console.assert(arc2.angle.angleType == ANGLETYPE_NORMAL || arc2.angle.angleType == ANGLETYPE_DVA_PI)
        let r1 = arc1.radius;
        let r2 = arc2.radius;
        let distance = Calc.getDistance(arc1.x, arc1.y, arc2.x, arc2.y);
        let crosstype = RELATION_NONE;
        let resArcs1 = [arc1.clone()];
        let resArcs2 = [arc2.clone()];
        let res = [crosstype, resArcs1, resArcs2];
        if (distance > r1 + r2) {
            crosstype = RELATION_OUT;
        }
        else if (distance <= Math.abs(r1 - r2)) {
            crosstype = RELATION_IN;
        }
        else {
            let crossArc1 = CalcCross.getCrossArc(arc1, arc2);
            let arc1_begIsOn = arc2.isPointInStroke(ctx, crossArc1.beginX, crossArc1.beginY);
            let arc1_endIsOn = arc2.isPointInStroke(ctx, crossArc1.endX, crossArc1.endY);

            if (arc1_begIsOn && arc1_endIsOn) {
                crosstype = RELATION_2CROSS;
                resArcs1 = [];
                if (arc1.isCircle) {
                    let a1 = arc1.clone();
                    a1.angle = new Angle(crossArc1.begin, crossArc1.end);
                    resArcs1.push(a1);
                    let a2 = arc1.clone();
                    a2.angle = new Angle(crossArc1.end, crossArc1.begin);
                    resArcs1.push(a2);
                }
                else
                    resArcs1 = arc1.splitAngs([crossArc1.begin, crossArc1.begin]);
                let crossArc2 = CalcCross.getCrossArc(arc2, arc1);
                resArcs2 = arc2.splitAngs([crossArc2.begin, crossArc2.end]);
            }
            else if (!arc1_begIsOn && !arc1_endIsOn) {
                let c2Inc1 = arc1.isPointInPath(ctx, arc2.beginX, arc2.beginY);
                if (c2Inc1)
                    crosstype = RELATION_IN;
                else
                    crosstype = RELATION_OUT;
            }
            else {
                crosstype = RELATION_1CROSS;
                let x, y, angval1;
                if (arc1_begIsOn) {
                    [x, y] = crossArc1.beginXY;
                    angval1 = crossArc1.begin;
                }
                else {
                    [x, y] = crossArc1.endXY;
                    angval1 = crossArc1.end;
                }
                resArcs1 = CalcCross._crossArcs(ctx, arc1, angval1, x, y);
                let angval2 = Calc.getAngle(arc2.x, arc2.y, x, y);
                resArcs2 = CalcCross._crossArcs(ctx, arc2, angval2, x, y);
            }
        }
        res = [crosstype, resArcs1, resArcs2];
        return res;
    }

    static _crossArcs(ctx, arc1, angval, x, y) {
        let resArcs = [];
        let a1, a2;
        if (arc1.isCircle) {
            let a1 = arc1.clone();
            let ang = new Angle(angval, angval + DVA_PI);
            if (a1.ccw)
                ang.reverse();
            a1.angle = ang;
            resArcs.push(a1);
        }
        else {
            [a1, a2] = arc1.splitXY(ctx, x, y);
            resArcs.push(a1);
            resArcs.push(a2);
            resArcs = arc1.splitAngs([angval]);
        }
        return resArcs;
    }

    static getCrossArc(arc1, arc2) {
        let r1 = arc1.radius;
        let r2 = arc2.radius;
        let distance = Calc.getDistance(arc1.x, arc1.y, arc2.x, arc2.y);
        let crossAngle = Angle.DVA_PI;
        let angle_base = Calc.getAngle(arc1.x, arc1.y, arc2.x, arc2.y);
        let angle_dev = Math.acos((r1 ** 2 + distance ** 2 - r2 ** 2) / (2 * r1 * distance));
        crossAngle.begin = angle_base - angle_dev;
        crossAngle.end = angle_base + angle_dev;
        if (r2 > distance && arc1.ccw != arc2.ccw)
            crossAngle.reverse();
        crossAngle.normalize();
        let crossArc = new Arc(arc1.x, arc1.y, arc1.radius, crossAngle, arc1.ccw);
        crossArc.normalize();
        return crossArc;
    }

    // returns cross points for a arc and a line
    static crossCircleVector(ctx, ccl, vector) {
        let angleCcl, res;
        let relType = RELATION_NONE;
        let cclRes = ccl.clone();
        let vecClone = vector.clone();
        let vecRes = [vecClone];
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
                angleCcl = new Angle(a_tmp1.value, a_tmp2.value);
                let p = vector.getPath();
                let arc1 = new Arc(ccl.x, ccl.y, ccl.radius, angleCcl, ccl.ccw);
                let beginIsOnLine = ctx.isPointInStroke(p, arc1.beginX, arc1.beginY);
                let endIsOnLine = ctx.isPointInStroke(p, arc1.endX, arc1.endY);
                if (beginIsOnLine && endIsOnLine) {
                    relType = RELATION_2CROSS;
                    vecRes = vector.cutMiddle(ctx, arc1.beginX, arc1.beginY, arc1.endX, arc1.endY);
                }
                else if (beginIsOnLine || endIsOnLine) {
                    relType = RELATION_1CROSS;
                    if (!beginIsOnLine) {
                        angleCcl.begin = angleCcl.end + DVA_PI;
                        vecRes = vecClone.cutBegin(ctx, arc1.endX, arc1.endY);
                    }
                    if (!endIsOnLine) {
                        angleCcl.end = angleCcl.begin + DVA_PI;
                        vecRes = vecClone.cutEnd(ctx, arc1.beginX, arc1.beginY);
                    }
                }
            }
            else if (h == ccl.radius) {
                relType = RELATION_CONTACT;
                angleCcl.begin = Calc.getAngle(ccl.x, ccl.y, hx, hy);
                angleCcl.end = angleCcl.begin;
            }
            cclRes.setAngles([angleCcl]);
        }
        res = [relType, cclRes, vecRes];
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
        [crosstype, ang1, ang2] = this.arcCross(ctx, ccl, arc);

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
                    let ret = this.arcCross(ol1, l1);
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
