export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  const WIDTH = 800;
  const HEIGHT = 600;

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
      ctx.translate(ship.pos.x, ship.pos.y);
      ctx.rotate(ship.angle);

      ctx.strokeStyle = "#00ffcc";
      ctx.fillStyle = "rgba(0, 255, 204, 0.2)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, 10);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
    drawAsteroid(asteroid) {
      ctx.save();
      ctx.translate(asteroid.pos.x, asteroid.pos.y);
      ctx.strokeStyle = "#ff3366";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
    drawBullet(bullet) {
      ctx.save();
      ctx.translate(bullet.pos.x, bullet.pos.y);
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  };
}
