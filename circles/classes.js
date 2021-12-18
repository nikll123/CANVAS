//-------------------------------------
// point
//-------------------------------------

var defaultColor = '#888888'

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.constructor.name + ': x=' + this.x + ', y=' + this.y;
    };

    render(ctx, radius = 0, color = defaultColor) {
        if (radius > 0) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    };
}

//-------------------------------------
// line
//-------------------------------------
class line {
    constructor(x1, y1, x2, y2) {
        this.point1 = new point(x1, y1);
        this.point2 = new point(x2, y2);
    }

    toString() {
        return this.constructor.name + '; ' + this.point1.toString() + '; ' + this.point1.toString();
    };

    render(ctx, width = 0, color = defaultColor) {
        if (width > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.point1.x, this.point1.y);
            ctx.lineTo(this.point2.x, this.point2.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
            ctx.restore();
        }
    };
}

//-------------------------------------
// shape
//-------------------------------------
class poligon {
    constructor(width = 0, colorFill = defaultColor, colorLine = defaultColor, points) {
        this.points;
    }

    toString() {
        return this.constructor.name + ':  x=' + this.x + ', y=' + this.y + ', fillStyle=' + this.colorFill;
    };

    render() {

    }

}

//-------------------------------------
// shapeDraggable
class shapeDraggable extends poligon {
    // constructor(x, y, fillStyle = '', lineWidth = -1) {
    //     super(x, y, fillStyle);
    //     this.isDragging = false;
    // }
}

//-------------------------------------
// rectangle
//-------------------------------------
class rectangle extends shapeDraggable {
    constructor(x, y, width, height, fillStyle) {
        super(x, y, fillStyle);
        this.width = width;
        this.height = height;
    }

    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.fillStyle;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', width=' + this.width + ', height=' + this.height;
    };
}

//-------------------------------------
// arc
//-------------------------------------
class arc extends shapeDraggable {
    constructor(x, y, radius, radians, fillStyle = '', lineWidth = -1) {
        super(x, y, fillStyle);
        this.radius = radius;
        this.radians = radians;
    }

    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.fillStyle;
        ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);
        ctx.fill();
        ctx.restore();
    };

    toString() {
        return super.toString() + ', radius=' + this.radius + ', radians=' + this.radians;
    };

}

class circle extends arc {
    constructor(x, y, radius, fillStyle) {
        super(x, y, radius, 2 * Math.PI, fillStyle);
    }
}

