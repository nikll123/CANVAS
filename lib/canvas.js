//  cleanup whole client area
class Canvas {
    static clearGrid(ctx, step = 10, showValues = true) {
        this.clearAll(ctx);
        this.grid(ctx, step, showValues);
    }

    static clearAll(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    static grid(ctx, step = 10, showValues = true) {
        ctx.save();
        let shift = 0.5;
        let color;
        for (let i = shift; i < ctx.canvas.width; i = i + step) {
            if ((i - shift) % 100 == 0)
                color = '#CCCCCC';
            else
                color = '#EEEEEE';
            ctx.strokeStyle = color;

            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(ctx.canvas.height, i);
            ctx.stroke();

        }
        if (showValues) {
            for (let i = 100; i < ctx.canvas.width; i = i + 100) {
                (new Text(i, 0, i)).render(ctx, DEFAULT_COLOR, '10px sans-serif', 'top');
                (new Text(0, i, i)).render(ctx, DEFAULT_COLOR, '10px sans-serif', 'top');
            }
        }
        ctx.restore();
        ctx.beginPath();  // preparation for the folowing drawing
    }
    static getCanvasCtx(name = 'canvas') {
        let canvas = document.getElementById(name);
        let ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
}