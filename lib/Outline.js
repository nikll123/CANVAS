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

    moveToStart(ctx) {
        if (this.lines.length > 0) {
            this.lines[0].moveToStart(ctx);
        }
    }

    build(ctx, connectParts = false) {
        for (let i = 0; i < this.lines.length; i++) {
            if (connectParts == false)
                this.lines[i].moveToStart(ctx);
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

    showDetails(ctx) {
        for (let i = 0; i < this.lines.length; i++) {
            let type = 0;
            if (i > 0)
                type = 2;
            this.lines[i].showDetails(ctx, type);
        }
    }

}
