//  cleanup whole client area
class Canvas {

static clearAll(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

static grid(ctx, step = 10, color = '#EEEEEE') {
    ctx.save();
    ctx.strokeStyle = color;
    for (var i = 0.5; i < ctx.canvas.width; i = i + step) {
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
