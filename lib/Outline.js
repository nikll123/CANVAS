//-------------------------------------
// Outline
//-------------------------------------
class Outline extends BasicShape {
    constructor(lines, id = 'ol') {
        super([], id);
        this.lines = [];
        for (let i = 0; i < lines.length; i++) {
            let l = lines[i];
            this.lines.push(l);
        }
    }

    push(line) {
        this.lines.push(line);
        this.points.push(line.startPoint);
        this.points.push(line.endtPoint);
    }

    build(ctx) {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].build(ctx);
        }
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
}
