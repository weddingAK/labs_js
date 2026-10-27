export function createRenderer(canvas, assets = { images: {} }) {
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

      const img = assets.images.ship;
      if (img) {
        // Малюємо спрайт по центру
        ctx.drawImage(
          img,
          -ship.radius,
          -ship.radius,
          ship.radius * 2,
          ship.radius * 2,
        );
      } else {
        // Fallback якщо картинка не завантажилась
        ctx.strokeStyle = "#00ffcc";
        ctx.strokeRect(
          -ship.radius,
          -ship.radius,
          ship.radius * 2,
          ship.radius * 2,
        );
      }
      ctx.restore();
    },
    drawAsteroid(asteroid) {
      ctx.save();
      ctx.translate(asteroid.pos.x, asteroid.pos.y);
      const img = assets.images.asteroid;
      if (img) {
        ctx.drawImage(
          img,
          -asteroid.radius,
          -asteroid.radius,
          asteroid.radius * 2,
          asteroid.radius * 2,
        );
      } else {
        ctx.strokeStyle = "#ff3366";
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
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
