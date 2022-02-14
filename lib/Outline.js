//-------------------------------------
// Outline
//-------------------------------------
class Outline extends BasicShape {
    constructor(lines=[], id = 'ol') {
        super([], id);
        this.lines = [];
        for (let i = 0; i < lines.length; i++) {
            let l = lines[i];
            this.push(l);
        }
    }

    push(line) {
        this.lines.push(line);
        // this.points.push(line.startPoint);
        // this.points.push(line.endtPoint);
    }

    moveToStart(ctx) {
        if (this.lines.length > 0) 
            this.lines[0].moveToStart(ctx);
    }

    build(ctx) {
        this.moveToStart(ctx);
        for (let i = 0; i < this.lines.length; i++)
            this.lines[i].buildInOutLine(ctx);
    }

    getPath() {
        let p = new Path2D();
        p.moveTo(this.x, this.y)
        for (let i = 0; i < this.lines.length; i++) {
            let l = this.lines[i];
            if (l.type == 'Arc')
                p.arc(l.x, l.y, l.radius, l.radians1, l.radians2, l.ccw);
            else if (l.type == 'Vector')
                p.lineTo(l.x2, l.y2);
            else
                console.assert();
        }
        p.closePath();
        return p;
    }

    draft(ctx, lineWidth = 1, colorStroke = DRAFT_COLOR, fillColor) {
        if (lineWidth > 0) {
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i].draft(ctx, lineWidth, colorStroke, fillColor);
            }
        }
    }

    toString() {
        let retstr = super.toString() + ': ';
        for (let i = 0; i < this.lines.length; i++) {
            retstr = retstr + this.lines[i].toString() + ',';
        }
        return retstr;
    };

    showDetails(ctx) {
        for (let i = 0; i < this.lines.length; i++) {
            let type = 0;
            if (i > 0)
                type = 2;
            this.lines[i].showDetails(ctx, type);
        }
    }

    visualize(ctx) {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].visualize(ctx);
        }
    }

    isPointInPath(ctx, x, y) {
        return ctx.isPointInPath(this.getPath(), x, y);
    }

}
