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

    render(ctx, radius = 1, color = DEFAULT_COLOR) {
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
class Angle1 extends Obj {
    constructor(value, id = 'ang1') {
        super(id);
        this.value = value;
    }
    substract(a) {
        this.value = this.value - a;
    }
    add(a) {
        this.value = this.value + a;
    }
    normalize() {
        this.value = Calc.angleNormalize(this.value);
    }

    render(ctx, x, y, text = '') {
        ctx.moveTo(x, y);
        let x2 = x + Math.cos(this.value) * 100;
        let y2 = y + Math.sin(this.value) * 100;
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if (text != '') {
            let t = new Text(x2, y2, text);
            t.render(ctx);
        }
    }
}

class Ray extends Point {
    constructor(x, y, angle1, lenght = 100, id = 'ray') {
        super(x, y, id);
        this.angle = angle1;
        this.lenght = lenght;
    }

    render(ctx) {
        ctx.moveTo(this.x, this.y);
        let x2 = this.x + Math.cos(this.angle) * this.lenght;
        let y2 = this.y + Math.sin(this.angle) * this.lenght;
        ctx.lineTo(x2, y2);
        ctx.stroke();
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

    normalize() {
        this.rayBegin.normalize();
        this.rayEnd.normalize();
    }

    reverse() {
        let a = this.rayBegin.value;
        this.rayBegin.value = this.rayEnd.value;
        this.rayEnd.value = a;
    }

    showDetails() {
        // dummy method
    }

    toString() {
        let retval = super.toString();
        retval = retval + ':beg=' + this.rayBegin.value + ',end=' + this.rayEnd.value;
        return retval;
    };

    render(ctx, x, y) {
        this.rayBegin.render(ctx, x, y, 'begin');
        this.rayEnd.render(ctx, x, y, 'end');
    }

    static get DVA_PI() {
        return new Angle(0, DVA_PI);
    }

    get angleType() {
        let type = ANGLETYPE_NONE;
        if (this.value == 0)
            type = ANGLETYPE_ZERO;
        else if (Math.abs(this.value) < DVA_PI)
            type = ANGLETYPE_NORMAL;
        else if (Math.abs(this.value) == DVA_PI)
            type = ANGLETYPE_DVA_PI;
        else
            type = ANGLETYPE_OVER;
        return type
    }
}



