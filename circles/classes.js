class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.constructor.name + ': x=' + this.x + ', y=' + this.y;
    };

    render(ctx) {
        ctx.save();
        let radius = 1;
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    };
}

class line {
    constructor(x1, y1, x2, y2, strokeStyle = '', lineWidth = -1) {
        this.point1 = new point(x1, y1);
        this.point2 = new point(x2, y2);
        if (strokeStyle != '')
            this.strokeStyle = strokeStyle;
        if (lineWidth != -1)
            this.lineWidth = lineWidth;
    }

    toString() {
        return this.constructor.name + '; ' + this.point1.toString() + '; ' + this.point1.toString() + '; strokeStyle=' + this.strokeStyle;
    };

    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);
        if (this.strokeStyle != undefined)
            ctx.strokeStyle = this.strokeStyle;
        if (this.lineWidth != undefined)
            ctx.lineWidth = this.lineWidth;

        ctx.stroke();
        ctx.restore();
    };
}

class shape {
    constructor(x, y, fillStyle) {
        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle;
    }

    toString() {
        return this.constructor.name + ':  x=' + this.x + ', y=' + this.y + ', fillStyle=' + this.fillStyle;
    };
}

class shapeDraggable extends shape {
    constructor(x, y, fillStyle) {
        super(x, y, fillStyle);
        this.isDragging = false;
    }
}

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

class arc extends shapeDraggable {
    constructor(x, y, radius, radians, fillStyle) {
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

