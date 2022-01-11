//-------------------------------------
// Line
//-------------------------------------

class Line extends ObjGraf {
    constructor(x1, y1, x2, y2, id = 'lin') {
        super(id, x1, y1);
        this.x2 = x2;
        this.y2 = y2;
    }

    toString() {
        let retval = super.toString();
        retval = retval + ':x2=' + this.x2 + ',y2=' + this.y2;
        return retval;
    };

    get startPoint() {
        let p = new Point(this.x, this.y);
        return p;
    }
    get endPoint() {
        let p = new Point(this.x2, this.y2);
        return p;
    }

    moveToStart(ctx) {
        ctx.moveTo(this.x, this.y);
    }

    render(ctx, width = 1, color = DEFAULT_COLOR) {
        this._render(ctx, width, color)
    }
    draft(ctx, width = 1, color = DRAFT_COLOR) {
        this._render(ctx, width, color, DRAFT)
    }

    build(ctx) {
        this.moveToStart(ctx);
        ctx.lineTo(this.x2, this.y2);
    }

    _render(ctx, width, color, draft = false) {
        if (width > 0) {
            ctx.save();
            ctx.beginPath();
            this.build(ctx);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            if (draft)
                ctx.setLineDash(DRAFT_LINE_PATTERN_5);
            ctx.stroke();
            ctx.restore();
        }
    };

    showDetails(ctx, pnts = 0) {
        ctx.save();
        ctx.fillStyle = DRAFT_COLOR;
        let text;
        if (pnts == 0 || pnts == 1) {
            text = this.id + ':' + this.x + ',' + this.y;
            ctx.fillText(text, this.x + 3, this.y - 3);
        }
        if (pnts == 0 || pnts == 2) {
            text = this.x2 + ',' + this.y2;
            ctx.fillText(text, this.x2 + 3, this.y2 - 3);
        }
        ctx.restore();
    }
}

//-------------------------------------
// line broken
//-------------------------------------
class LineBroken extends BasicShape {
    constructor(pointsArg, id = 'lb') {
        super(pointsArg, id);
    }

    toString() {
        let reval = super.toString() + ':'
        for (let i = 0; i < this.points.length; i++) {
            reval = reval + this.points[i].toString() + ';';
        };
        return reval;
    }

    render(ctx, widthStroke = 0, closePath = false, colorStroke = DEFAULT_COLOR, colorFill) {
        if (widthStroke > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            let p = this.points[0];
            p.render(ctx);
            for (let i = 1; i < this.points.length; i++) {
                p = this.points[i]
                ctx.lineTo(p.x, p.y);
                p.render(ctx);
            };
            if (closePath)
                ctx.closePath();
            ctx.strokeStyle = colorStroke;
            ctx.lineWidth = widthStroke;
            ctx.stroke();
            if (colorFill != undefined) {
                ctx.fillStyle = colorFill;
                ctx.fill();
            }
            ctx.restore();
        }
    };

    get startPoint() {
        let ret = undefined;
        if (this.points.length > 0)
            ret = points[0];
        return ret;
    }
    get endPoint() {
        let ret = undefined;
        if (this.points.length > 0)
            ret = points[points.length - 1];
        return ret;
    }
}

//-------------------------------------
// poligon
//-------------------------------------
class Poligon extends LineBroken {
    constructor(pointsArg, anglecount) {
        if (pointsArg.length == anglecount) {
            super(pointsArg);
            this.isDragging = false;
        }
        else
            console.debug('Failed to create due to wrong number of points');
    }

    render(ctx, widthStroke = 0, colorStroke = DEFAULT_COLOR, colorFill) {
        super.render(ctx, widthStroke, true, colorStroke, colorFill);
    }
}

//-------------------------------------
// triangle
//-------------------------------------
class Triangle extends Poligon {
    constructor(pointsArg) {
        super(pointsArg, 3);
    }
    isPointInside(x, y) {
        return Calc.isPointInsideTriangle(x, y, this.points[0], this.points[1], this.points[2]);
    }
}

//-------------------------------------
// quadrangle
//-------------------------------------
class Quadrangle extends Poligon {
    constructor(pointsArg) {
        super(pointsArg, 4);
    }
    isPointInside(x, y) {
        let r1 = Calc.isPointInsideTriangle(x, y, this.points[0], this.points[1], this.points[2]);
        let r2 = Calc.isPointInsideTriangle(x, y, this.points[0], this.points[2], this.points[3]);
        return r1 || r2;
    }
}

//-------------------------------------
// rectangle
//-------------------------------------
class Rectangle extends BasicShape {
    constructor(x, y, width, height) {
        super([[x, y]]);
        this.width = width;
        this.height = height;
    }

    render(ctx, lineWidth, fillColor = DEFAULT_COLOR) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', width=' + this.width + ', height=' + this.height;
    };

    isPointInside(x, y) {
        let r1 = x >= this.x && x <= this.x + this.width;
        let r2 = y >= this.y && y <= this.y + this.height;
        return r1 && r2;
    }
}
