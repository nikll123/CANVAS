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
// line broken
//-------------------------------------
class lineBroken {
    constructor(points1) {
        this.points = [];
        for (var i = 0; i < points1.length; i++) {
            var p = points1[i];
            this.points.push(new point(p[0], p[1]));
        }
    }

    toString() {
        var reval = this.constructor.name + ': '
        for (var i = 0; i < this.points.length; i++) {
            reval = reval + this.points[i].toString() + '; ';
        };
        return reval;
    }

    render(ctx, width = 0, closePath = false, colorStroke = defaultColor, colorFill) {
        if (width > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);;
            };
            if (closePath)
                ctx.closePath();
            ctx.strokeStyle = colorStroke;
            ctx.lineWidth = width;
            ctx.stroke();
            if (colorFill != undefined) {
                ctx.fillStyle = colorFill;
                ctx.fill();
            }

            ctx.restore();
        }
    };
}




//-------------------------------------
// shape
//-------------------------------------
class triangle extends lineBroken {
    constructor(width = 0, colorFill = defaultColor, colorLine = defaultColor, points) {
        this.points;
    }

    toString() {
        return this.constructor.name + ':  x=' + this.x + ', y=' + this.y + ', fillStyle=' + this.colorFill;
    };

    render() {

    }

}

// //-------------------------------------
// shapeDraggable
// class shapeDraggable extends poligon {
//     // constructor(x, y, fillStyle = '', lineWidth = -1) {
//     //     super(x, y, fillStyle);
//     //     this.isDragging = false;
//     // }
// }

// //-------------------------------------
// // rectangle
// //-------------------------------------
// class rectangle extends shapeDraggable {
//     constructor(x, y, width, height, fillStyle) {
//         super(x, y, fillStyle);
//         this.width = width;
//         this.height = height;
//     }

//     render(ctx) {
//         ctx.save();
//         ctx.beginPath();
//         ctx.fillStyle = this.fillStyle;
//         ctx.rect(this.x, this.y, this.width, this.height);
//         ctx.fill();
//         ctx.restore();
//     };

//     toString() {
//         return super.toString() + ', width=' + this.width + ', height=' + this.height;
//     };
// }

// //-------------------------------------
// // arc
// //-------------------------------------
// class arc extends shapeDraggable {
//     constructor(x, y, radius, radians, fillStyle = '', lineWidth = -1) {
//         super(x, y, fillStyle);
//         this.radius = radius;
//         this.radians = radians;
//     }

//     render(ctx) {
//         ctx.save();
//         ctx.beginPath();
//         ctx.fillStyle = this.fillStyle;
//         ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);
//         ctx.fill();
//         ctx.restore();
//     };

//     toString() {
//         return super.toString() + ', radius=' + this.radius + ', radians=' + this.radians;
//     };

// }

// class circle extends arc {
//     constructor(x, y, radius, fillStyle) {
//         super(x, y, radius, 2 * Math.PI, fillStyle);
//     }
// }

