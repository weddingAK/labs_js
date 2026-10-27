export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  // Базові розміри віртуальної арени
  const WIDTH = 800;
  const HEIGHT = 600;

  // Налаштування під Retina / devicePixelRatio
  const dpr = window.devicePixelRatio || 1;
  canvas.width = WIDTH * dpr;
  canvas.height = HEIGHT * dpr;
  canvas.style.width = `${WIDTH}px`;
  canvas.style.height = `${HEIGHT}px`;
  ctx.scale(dpr, dpr);

  return {
    width: WIDTH,
    height: HEIGHT,
    clear() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    },
    drawShip(ship) {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);

      // Малюємо трикутний корабель
      ctx.strokeStyle = "#00ffcc";
      ctx.fillStyle = "rgba(0, 255, 204, 0.2)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(15, 0); // ніс корабля
      ctx.lineTo(-10, -10); // ліве крило
      ctx.lineTo(-5, 0); // центр ззаду
      ctx.lineTo(-10, 10); // праве крило
      ctx.closePath();

      ctx.fill();
      ctx.stroke();

      ctx.restore();
    },
  };
}
