class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDragging = false;

        this.render = function (ctx) {
            ctx.save();

            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#2793ef';
            ctx.fill();

            ctx.restore();
        };
    }
}

class Arc {
    constructor(x, y, radius, radians) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.radians = radians;
        this.isDragging = false;

        this.render = function (ctx) {
            ctx.save();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);
            ctx.fillStyle = '#2793ef';
            ctx.fill();

            ctx.restore();
        };
    }
}
