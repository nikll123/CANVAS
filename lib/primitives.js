//-------------------------------------
// point
//-------------------------------------
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString(long = true) {
        var retval;
        if (long)
            retval = this.constructor.name + ': ' + 'x=' + this.x + ', y=' + this.y;
        else
            retval = this.x + ' ' + this.y;
        return retval;
    };

    render(ctx, radius, color = DEFAULT_COLOR) {
        this._render(ctx, radius, color)
    }
    draft(ctx, radius = 1, color = DRAFT_COLOR) {
        this._render(ctx, radius, color, DRAFT)
    }

    _render(ctx, radius = 0, color, draft = false) {
        ctx.save();
        if (radius > 0) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, DVA_PI);
            ctx.fill();
        }
        if (draft) {
            var text = this.toString(false);
            ctx.fillStyle = DRAFT_COLOR;
            ctx.fillText(text, this.x + radius + 1, this.y - radius - 1);
        }
        ctx.restore();
    };

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

//-------------------------------------
// text
//-------------------------------------
class Text {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }

    render(ctx, color = DEFAULT_COLOR, font = '10px sans-serif',) {
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    };
}


//-------------------------------------
// Angle
//-------------------------------------
class Angle {
    constructor(begin, end) {
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
        var a = this.end;
        if (a != 0) {
            var cnt = this._countPI(a);
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

    render(ctx, x, y, radius = 0, color = DEFAULT_COLOR) {
        if (radius > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            var x1 = x + Math.cos(this.begin) * radius;
            var y1 = y + Math.sin(this.begin) * radius;
            var x2 = x + Math.cos(this.end) * radius;
            var y2 = y + Math.sin(this.end) * radius;
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
            if (globalDebugMode) {
                ctx.fillText('b:' + this.begin.toFixed(2), x1 + 1, y1 - 1);
                ctx.fillText('e:' + this.end.toFixed(2), x2 + 1, y2 - 1);
            }
        }
    }

    toString() {
        var retval = this.constructor.name + ': ';
        retval = retval + this.begin + ' ' + this.end;
        return retval;
    };
}
