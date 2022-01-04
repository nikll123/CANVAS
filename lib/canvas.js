//  cleanup whole client area
class Canvas {

    static clearAll(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    static grid(ctx, step = 10) {
        ctx.save();
        var shift = 0.5;
        var color;
        for (var i = shift; i < ctx.canvas.width; i = i + step) {
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
        ctx.restore();
    }
}
