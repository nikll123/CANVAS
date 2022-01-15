//-------------------------------------
// Vector
//-------------------------------------
class Vector extends ObjGraf {
    constructor(x1, y1, x2, y2, id = 'vec') {
        super(id, x1, y1);
        this.x2 = x2;
        this.y2 = y2;
    }

    get length() {
        return getDistance(this.x, this.y, this.x2, this.y2);
    }

    get azimuth() {
        let res;
        if (this.x == this.x2) {
            if (this.y == this.y2)
                res = AZIMUTH.NONE;
            else if (this.y > this.y2)
                res = AZIMUTH.N;
            else
                res = AZIMUTH.S;
        } else if (this.y == this.y2) {
            if (this.x > this.x2)
                res = AZIMUTH.W;
            else
                res = AZIMUTH.E;
        } else if (this.x > this.x2 && this.y > this.y2)
            res = AZIMUTH.WN;
        else if (this.x > this.x2 && this.y < this.y2)
            res = AZIMUTH.SW;
        else if (this.x < this.x2 && this.y < this.y2)
            res = AZIMUTH.ES;
        else
            res = AZIMUTH.NE;
        return res;
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
        ctx.lineTo(this.x, this.y);
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

    pointXY(perc) { // return X and Y coordiantes of a point of the vector displaced at x% from the begin
        let x = this._percXY(this.x, this.x2, perc);
        let y = this._percXY(this.y, this.y2, perc);
        return [x, y];
    }

    _percXY(x, x2, perc) {
        return x + (x2 - x) * perc / 100;
    }
}

class VectorComposite extends Vector {
    constructor(x1, y1, x2, y2, lines = [[0,100]], id = 'vc') {
        super(x1, y1, x2, y2, id);
        this.lines = lines;
    }

    render(ctx, width = 1, color = DEFAULT_COLOR) {
        this._render(ctx, width, color)
    }
    draft(ctx, width = 1, color = DRAFT_COLOR) {
        this._render(ctx, width, color, DRAFT)
    }

    build(ctx) {
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
    }

    _render(ctx, width, color, draft = false) {
        let x1, y1, x2, y2, perc1, perc2, l;
        for (let i = 0; i < this.lines.length; i++) {
            perc1 = this.lines[i][0];
            perc2 = this.lines[i][1];
            [x1, y1] = this.pointXY(perc1);
            [x2, y2] = this.pointXY(perc2);
            l = new Vector(x1, y1, x2, y2);
            l._render(ctx, width, color, draft);
        }
    }
}