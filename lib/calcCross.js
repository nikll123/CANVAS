// Different calculations 

class CalcCross {

    static crossVectorArc(ctx, vec, arc) {
        console.assert(arc.angle.value <= DVA_PI)
        // let crossType = LINEPNTPOS_NONE;
        let resArc = arc.clone();
        let res = [];
        let h, hx, hy, h_angle, pos;
        [h, hx, hy, h_angle, pos] = Calc.getAltitudeTriangle(vec.x, vec.y, vec.x2, vec.y2, resArc.x, resArc.y);
        if (h < arc.radius) {
            resArc = arc.convertToArc();
            let a_tmp1 = new Angle1(h_angle);
            let a_tmp2 = new Angle1(h_angle);
            if (h == 0) {
                a_tmp2.value = vec.angle;
                a_tmp1.value = vec.angle - PI;
            }
            else {
                let a1 = Math.acos(Math.abs(h) / resArc.radius);
                if (pos == LINEPNTPOS_LEFT)
                    a1 = - a1;
                a_tmp1.substract(a1);
                a_tmp2.add(a1);
            }
            let ang1 = new Angle(a_tmp1.value, a_tmp2.value);
            ang1.normalizeEnd(resArc.ccw);
            resArc.angle = ang1;
            let pBeg = new Point(resArc.beginX, resArc.beginY);
            let pEnd = new Point(resArc.endX, resArc.endY);
            let dBeg = Calc.getDistance(vec.x, vec.y, pBeg.x, pBeg.y);
            let dEnd = Calc.getDistance(vec.x, vec.y, pEnd.x, pEnd.y);
            if (dEnd < dBeg)
                resArc.angle.reverse();
            resArc.normalize();
            let isBegOn = vec.isPointInStroke(ctx, pBeg.x, pBeg.y);
            let isEndOn = vec.isPointInStroke(ctx, pEnd.x, pEnd.y);
            if (isBegOn && isEndOn) {
                // crossType = RELATION_CROSS_2;
                res = [pBeg, pEnd];
            }
            else {
                // crossType = RELATION_CROSS_1;
                if (isBegOn)
                    res = [pBeg];
                else  //isEndOn
                    res = [pEnd];
            }
        }
        else if (h == arc.radius) {
            // crossType = RELATION_CONTACT;
            res = [new Point(hx, hy)]
        }
        else {
            // crossType = RELATION_OUT;
        }
        return res;
    }

    // returns resulting cross type and outline array
    static crossArcArc(ctx, arcMain, arcSecond) {
        console.assert(arcMain.angle.value <= DVA_PI)
        console.assert(arcSecond.angle.value <= DVA_PI)
        let r1 = arcMain.radius;
        let r2 = arcSecond.radius;
        let distance = Calc.getDistance(arcMain.x, arcMain.y, arcSecond.x, arcSecond.y);
        let crossType = RELATION_NONE;
        let resOl = [];
        const res = [crossType, resOl];
        let resArcs1, resArcs2;
        if (distance > r1 + r2) {
            crossType = RELATION_OUT;
        }
        else if (distance <= Math.abs(r1 - r2)) {
            crossType = RELATION_IN;
            if (r1 > r2)
                resOl = [arcMain.clone()];
            else
                resOl = [arcSecond.clone()];
        }
        else {
            let crossArcMain = CalcCross.getCrossArc(arcMain, arcSecond);
            let arcM_begIsOnS = arcSecond.isPointInStroke(ctx, crossArcMain.beginX, crossArcMain.beginY);
            let arcM_endIsOnS = arcSecond.isPointInStroke(ctx, crossArcMain.endX, crossArcMain.endY);

            if (arcM_begIsOnS && arcM_endIsOnS) {
                crossType = RELATION_CROSS_2;
                resArcs1 = [];
                if (arcMain.isCircle) {
                    let a1 = arcMain.clone();
                    a1.angle = new Angle(crossArcMain.begin, crossArcMain.end);
                    resArcs1.push(a1);
                    let a2 = arcMain.clone();
                    a2.angle = new Angle(crossArcMain.end, crossArcMain.begin);
                    resArcs1.push(a2);
                }
                else
                    resArcs1 = arcMain.splitAngs([crossArcMain.begin, crossArcMain.end]);
                let crossArc2 = CalcCross.getCrossArc(arcSecond, arcMain);
                resArcs2 = arcSecond.splitAngs([crossArc2.begin, crossArc2.end]);
            }
            else if (!arcM_begIsOnS && !arcM_endIsOnS) {
                let c2Inc1 = arcMain.isPointInPath(ctx, arcSecond.beginX, arcSecond.beginY);
                if (c2Inc1)
                    crossType = RELATION_IN;
                else
                    crossType = RELATION_OUT;
            }
            else {
                crossType = RELATION_CROSS_1;
                let x, y, angval1;
                if (arcM_begIsOnS) {
                    [x, y] = crossArcMain.beginXY;
                    angval1 = crossArcMain.begin;
                }
                else {
                    [x, y] = crossArcMain.endXY;
                    angval1 = crossArcMain.end;
                }
                let resOl1 = [];
                resOl1.push(CalcCross._crossArcs(ctx, arcMain, angval1, x, y)[0]);
                const angval2 = Calc.getAngle(arcSecond.x, arcSecond.y, x, y);

                let a = CalcCross._crossArcs(ctx, arcSecond, angval2, x, y);
                for (let i = 0; i < a.length; i++)
                    resOl1.push(a[i]);

                let j = 0;
                resOl.push(resOl1[0]);
                for (let i = 1; i < resOl1.length; i++) {
                    if (resOl[j].endX == resOl1[i].beginX && resOl[j].endY == resOl1[i].beginY) {
                        resOl.push(resOl1[i]);
                        j++;
                    }
                }
            }
        }
        return [crossType, resOl];
    }

    static crossOlArc(ctx, ol, arc) {
        for (let i = 0; i < ol.lines.length; i++) {
            const l = ol.lines[i];
            let reltype, ol1, arc1;
            switch (l.type) {
                case 'Arc':
                    [reltype, ol1] = this.crossArcArc(ctx, l, arc);
                    break;
                case 'Vector':
                    [reltype, arc1] = this.crossVectorArc(ctx, l, arc);
                    arc = arc1;
                    ol1.draft(ctx);
                    break;
                default:
                    break;
            }
        }
    }

    static _crossArcs(ctx, arc1, angval, x, y) {
        let resArcs = [];
        if (arc1.isCircle) {
            let a1 = arc1.clone();
            let ang = new Angle(angval, angval + DVA_PI);
            if (a1.ccw)
                ang.reverse();
            a1.angle = ang;
            resArcs.push(a1);
        }
        else {
            resArcs = arc1.splitXY(ctx, x, y);
        }
        return resArcs;
    }

    static getCrossArc(arcMain, arcSecond) {
        let r1 = arcMain.radius;
        let r2 = arcSecond.radius;
        let distance = Calc.getDistance(arcMain.x, arcMain.y, arcSecond.x, arcSecond.y);
        let crossAngleMain = Angle.DVA_PI;
        let angle_base = Calc.getAngle(arcMain.x, arcMain.y, arcSecond.x, arcSecond.y);
        let angle_dev = Math.acos((r1 ** 2 + distance ** 2 - r2 ** 2) / (2 * r1 * distance));
        if (arcMain.ccw == CCW)
            angle_dev = -angle_dev;
        crossAngleMain.begin = angle_base - angle_dev;
        crossAngleMain.end = angle_base + angle_dev;
        if (r2 > distance && arcMain.ccw != arcSecond.ccw)
            crossAngleMain.reverse();
        crossAngleMain.normalizeEnd(arcMain.ccw);
        let crossArcMain = new Arc(arcMain.x, arcMain.y, arcMain.radius, crossAngleMain, arcMain.ccw);
        crossArcMain.normalize();
        return crossArcMain;
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
            [h, hx, hy, angle_vector] = Calc.getAltitudeTriangle(vector.x, vector.y, vector.x2, vector.y2, ccl.x, ccl.y);
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
                angleCcl.normalizeEnd(ccl.ccw);
                let p = vector.getPath();
                let arc1 = new Arc(ccl.x, ccl.y, ccl.radius, angleCcl, ccl.ccw);
                let beginIsOnLine = ctx.isPointInStroke(p, arc1.beginX, arc1.beginY);
                let endIsOnLine = ctx.isPointInStroke(p, arc1.endX, arc1.endY);
                if (beginIsOnLine && endIsOnLine) {
                    relType = RELATION_CROSS_2;
                    vecRes = vector.cutMiddle(ctx, arc1.beginX, arc1.beginY, arc1.endX, arc1.endY);
                }
                else if (beginIsOnLine || endIsOnLine) {
                    relType = RELATION_CROSS_1;
                    if (!beginIsOnLine) {
                        angleCcl.begin = angleCcl.end + DVA_PI;
                        vecRes = vecClone.cutBegin(ctx, arc1.endX, arc1.endY);
                    }
                    if (!endIsOnLine) {
                        angleCcl.end = angleCcl.begin + DVA_PI;
                        vecRes = vecClone.cutEnd(ctx, arc1.beginX, arc1.beginY);
                    }
                    angleCcl.normalizeEnd(ccl.ccw);
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
        [crosstype, ang1, ang2] = this.crossArcArc(ctx, ccl, arc);

        if (crosstype == RELATION_OUT)
            ;
        else if (crosstype == RELATION_IN) {
            crossAngle = null;
            ol.lines.splice(i, 1);
            i--;
        }
        else if (crosstype == RELATION_CROSS_1) {
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
        else if (crosstype == RELATION_CROSS_2) {
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
            if (relType == RELATION_CROSS_1 || relType == RELATION_CROSS_2) {
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
                    let ret = this.crossArcArc(ol1, l1);
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
