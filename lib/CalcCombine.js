class CalcCombine {
    static combineVecCircle(ctx, vec, circle, points) {
        let pLen = points.length;
        console.assert(pLen > 0 && pLen <= 2)
        let ol = new Outline();
        if (pLen == 1) {
            let p = points[0];
            let d = Calc.getDistance(circle.x, circle.y, p.x, p.y);
            let v1, v2, arc;
            if (circle.radius == d) { // Contact
                [v1, v2] = vec.cut(ctx, p.x, p.y);
                [arc] = circle.splitXY(ctx, p.x, p.y);
                ol.push(v1);
                ol.push(arc);
                ol.push(v2);
            }
            else {

            }

        }
        else { // 2
            let p1 = points[0];
            let p2 = points[1];            
            let v1, v2
            [v1, v2] = vec.cutMiddle(ctx, p1.x, p1.y, p2.x, p2.y);
            circle.cut


        }
        return ol;
    }
}