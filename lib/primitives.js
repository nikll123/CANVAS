//-------------------------------------
// point
//-------------------------------------
class Point extends ObjGraf {
    constructor(x, y, id = 'pnt') {
        super(id, x, y);
    }

    showDetails(ctx, radius = 1, color = DRAFT_COLOR) {
        ctx.save();
        let text = this.toString(FORMAT.SHORT);
        ctx.fillStyle = DRAFT_COLOR;
        let textMetrics = ctx.measureText(text);
        ctx.fillText(text, this.x - textMetrics.width / 2, this.y - radius - 3);
        ctx.restore();
    }
    render(ctx, radius, color = DEFAULT_COLOR) {
        this._render(ctx, radius, color)
    }
    draft(ctx, radius = 1, color = DRAFT_COLOR) {
        this._render(ctx, radius, color)
    }

    _render(ctx, radius = 0, color) {
        if (radius > 0) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, DVA_PI);
            ctx.fill();
            ctx.restore();
        }
    };

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

//-------------------------------------
// text
//-------------------------------------
class Text extends ObjGraf {
    constructor(x, y, text, id = 'txt') {
        super(id, x, y);
        this.text = text;
    }

    render(ctx, color = DEFAULT_COLOR, font = '10px sans-serif',) {
        this._render(ctx, color, font);
    }

    draft(ctx, color = DEFAULT_COLOR, font = '10px sans-serif', DFART) {
        this._render(ctx, color, font, DRAFT);
    }

    _render(ctx, color, font, draft = false) {
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = color;
        let txt = '';
        if (draft)
            txt = this.id + ':';
        txt = txt + this.text;
        ctx.fillText(txt, this.x, this.y);
        ctx.restore();
    };
}

//-------------------------------------
// Angle
//-------------------------------------
class Angle extends ObjGraf {
    constructor(begin, end, id = 'ang') {
        super(id, undefined, undefined);
        this.begin = begin;
        this.end = end;
    }

    get value() {
        return this.end - this.begin;
    }

    substract(a) {
        this.end = this.end - a;
        this.normalize();
    }

    add(a) {
        this.end = this.end + a;
        this.normalize();
    }

    normalize() {
        let a = this.end;
        if (a != 0) {
            let cnt = this._countPI(a);
            if (cnt != 0)
                a = a - cnt * DVA_PI;
            if (a < 0)
                a = DVA_PI + a;
            this.end = a
        }
    }

    _countPI(a) {
        return Math.sign(a) * Math.floor(Math.abs(a) / DVA_PI);
    }

    showDetails() {
        ctx.save();
        ctx.fillStyle = DRAFT_COLOR;
        ctx.fillText('b:' + Calc.round(this.begin,2), x1 + 1, y1 - 1);
        ctx.fillText('e:' + Calc.round(this.end,2), x2 + 1, y2 - 1);
        ctx.restore();
    }

    toString() {
        let retval = super.toString();
        retval = retval + ':beg=' + this.begin + ',end=' + this.end;
        return retval;
    };
}
