export function drawLine(
    [x0, y0]: [number, number],
    [x1, y1]: [number, number],
    draw: (x: number, y: number) => void
) {
    const xDiff = x1 - x0;
    const yDiff = y1 - y0;
    if (Math.abs(xDiff) >= Math.abs(yDiff)) {
        const xStep = xDiff > 0 ? 1 : -1;
        const yStep = yDiff / Math.abs(xDiff);
        for (let x = x0, y = y0; x !== x1; x += xStep, y += yStep) {
            draw(x, Math.round(y));
        }
    } else {
        const xStep = xDiff / Math.abs(yDiff);
        const yStep = yDiff > 0 ? 1 : -1;
        for (let x = x0, y = y0; y !== y1; x += xStep, y += yStep) {
            draw(Math.round(x), y);
        }
    }
}
