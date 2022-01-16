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
        ctx.fillStyle = color;
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

    showDetails() {
        //dummy method;
    }
}

//-------------------------------------
// Angle1
//-------------------------------------
class Angle1 extends ObjGraf {
    constructor(value, id = 'ang1') {
        super(id, undefined, undefined);
        this.value = value;
    }

    substract(a) {
        this.value = this.value - a;
    }

    add(a) {
        this.value = this.value + a;
    }

    normalize() {
        let a = this.value;
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
}

//-------------------------------------
// Angle
//-------------------------------------
class Angle extends ObjGraf {
    constructor(begin, end, id = 'ang') {
        super(id, undefined, undefined);
        this.rayBegin = new Angle1(0);
        this.rayEnd = new Angle1(0);
        this.begin = begin;
        this.end = end;
    }

    get value() {
        return this.rayEnd.value - this.rayBegin.value;
    }

    get begin() {
        return this.rayBegin.value;
    }
    set begin(value) {
        this.rayBegin.value = value;
    }

    get end() {
        return this.rayEnd.value;
    }
    set end(value) {
        this.rayEnd.value = value;
    }

    substract(a) {
        this.rayEnd.substract(a);
    }

    add(a) {
        this.rayEnd.add(a);
    }

    showDetails() {
        // dummy method
    }

    toString() {
        let retval = super.toString();
        retval = retval + ':beg=' + this.rayBegin.value + ',end=' + this.rayEnd.value;
        return retval;
    };
}

