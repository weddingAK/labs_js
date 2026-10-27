export function createShip(x, y) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle: 0, // в радіанах
    radius: 15,
  };
}

export function integrate(ship, input, dt) {
  const TURN_SPEED = Math.PI * 1.5; // швидкість повороту за сек
  const ACCELERATION = 300; // прискорення піксель/сек²
  const FRICTION = 0.98; // затухання швидкості

  // 1. Поворот (A/D або Стрілки вліво/вправо)
  if (input.isDown("KeyA") || input.isDown("ArrowLeft")) {
    ship.angle -= TURN_SPEED * dt;
  }
  if (input.isDown("KeyD") || input.isDown("ArrowRight")) {
    ship.angle += TURN_SPEED * dt;
  }

  // 2. Тяга (W або Стрілка вгору)
  let thrusting = false;
  if (input.isDown("KeyW") || input.isDown("ArrowUp")) {
    thrusting = true;
  }

  if (thrusting) {
    ship.vx += Math.cos(ship.angle) * ACCELERATION * dt;
    ship.vy += Math.sin(ship.angle) * ACCELERATION * dt;
  }

  // 3. Тертя/опір простору
  ship.vx *= Math.pow(FRICTION, dt * 60);
  ship.vy *= Math.pow(FRICTION, dt * 60);

  // 4. Оновлення позиції
  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;

  // 5. Загортання країв арени (Screen Wrapping)
  const width = 800;
  const height = 600;

  if (ship.x < 0) ship.x += width;
  if (ship.x > width) ship.x -= width;
  if (ship.y < 0) ship.y += height;
  if (ship.y > height) ship.y -= height;
}
