// throw new Error("Can't instantiate abstract class!"); - just to remember

// abstract classes
class Obj {
    constructor(id) {
        this.id = id;
        this.state = STATUS.NORMAL;
    }

    toString() {
        let retval = this.id;
        return retval;
    };

    get type() {
        return this.constructor.name;
    }
}

// abstract classes
class ObjGraf extends Obj {
    constructor(id, x, y) {
        super(id);
        this.x = x;
        this.y = y;
    }

    toString(fmt = FORMAT.LONG) {
        let retval = super.toString() + ':'
        if (this.x != undefined) {
            let t1 = '';
            if (fmt == FORMAT.LONG)
                t1 = 'x=';
            retval = retval + t1 + Calc.round(this.x) + ',';
        }
        if (this.y != undefined) {
            let t1 = '';
            if (fmt == FORMAT.LONG)
                t1 = 'y=';
            retval = retval + t1 + Calc.round(this.y);
        }
        return retval;
    };
}

//-------------------------------------
// BasicShape
// let bs = new BasicShape([[100, 200],[10, 20],[30, 50]], id = 'bs1');
//-------------------------------------
class BasicShape extends Obj {
    constructor(pointsArg, id = 'bs') {
        super(id);
        this.points = [];
        for (let i = 0; i < pointsArg.length; i++) {
            let p = pointsArg[i];
            let pp = new Point(p[0], p[1], 'p' + i);
            this.points.push(pp);
        }
    }

    move(dx, dy) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].move(dx, dy);
        };
    }

    moveToStart(ctx) {
        ctx.moveTo(this.x, this.y);
    };

    moveIfDragging(dx, dy) {
        if (this.isDragging)
            this.move(dx, dy);
    }

    isPointInPath(x, y) {
        console.assert(false, 'to be overwritten');
    }

    startDrag() {
        this.isDragging = true;
    }

    stopDrag() {
        this.isDragging = false;
    }

    startDrugIfPointIsInside(ctx, x, y) {
        if (this.isPointInPath(ctx, x, y))
            this.startDrag();
    }

    showDetails(ctx) {
        let p1 = new Point(this.points[0].x, this.points[0].y, this.id)
        p1.showDetails(ctx);
    }

    build() {
        console.assert(false, 'to be overwritten');
    }

    render(ctx, lineWidth = 1, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor)
    }
    draft(ctx, lineWidth = 1, colorStroke = DEFAULT_COLOR, fillColor) {
        this._render(ctx, lineWidth, colorStroke, fillColor, DRAFT)
    }

    _render(ctx, lineWidth, colorStroke, fillColor, draft = false) {
        ctx.save();
        ctx.beginPath();
        this.build(ctx);
        if (lineWidth > 0) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = colorStroke;
            if (draft)
                ctx.setLineDash(DRAFT_LINE_PATTERN_5);
            ctx.stroke();
        }
        if (fillColor != undefined) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        ctx.restore();

    }

    get x() {
        let x = undefined;
        if (this.points.length > 0)
            x = this.points[0].x;
        return x;
    }

    get y() {
        let y = undefined;
        if (this.points.length > 0)
            y = this.points[0].y;
        return y;
    }

    set x(x) {
        this.points[0].x = x;
    }

    set y(y) {
        this.points[0].y = y;
    }
}

function drawArrowArc(ctx, x, y, r, a1, ccw) {
    let endX = x + r * Math.cos(a1);
    let endY = y + r * Math.sin(a1);
    let k = 1;
    if (ccw)
        k = -1;
    a1 = a1 + k * PI / 2;
    drawArrow(ctx, endX, endY, a1)
}

function drawArrow(ctx, x, y, a1) {
    let a2 = PI / 8;
    let d = 8;
    let x1 = x - d * Math.cos(a1 + a2);
    let y1 = y - d * Math.sin(a1 + a2);
    let x2 = x - d * Math.cos(a1 - a2);
    let y2 = y - d * Math.sin(a1 - a2);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.setLineDash([]);
    ctx.fillStyle = DRAFT_COLOR;
    ctx.fill();
}

class LineComposite extends Obj {
    constructor(id = 'lc', length, parts=[]) {
        super(id);
        this.lengthBasis = length;
        this.parts = parts; // array of values
    }
}