class shape {
    constructor(id, x, y, fillStyle) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle; 
        this.classname = 'shape';
    }

    toString() {
        return this.classname + ': id=' + this.id + ', fillStyle=' + this.fillStyle + ', x=' + this.x + ', y=' + this.y;
    };
}

class shapeDraggable extends shape {
    constructor(id, x, y, fillStyle) {
        super(id, x, y, fillStyle);
        this.classname = 'shapeDraggable';
        this.isDragging = false;
    }
}

class rectangle extends shapeDraggable {
    constructor(id, x, y, width, height, fillStyle) {
        super(id, x, y, fillStyle);
        this.classname = 'rectangle';
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
    constructor(id, x, y, radius, radians, fillStyle) {
        super(id, x, y, fillStyle);
        this.classname = 'arc';
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
        return super.toString() + ', radius=' + this.radius + ', radians=' + this.radians ;
    };

}

class circle extends arc {
    constructor(id, x, y, radius, fillStyle) {
        super(id, x, y, radius, 2 * Math.PI, fillStyle) ;
        this.classname = 'circle';
    }
}

