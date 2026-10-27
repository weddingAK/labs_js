import { createInput } from "./input.js";
import { Ship } from "./entities/Ship.js";
import { Asteroid } from "./entities/Asteroid.js";
import { World } from "./entities/World.js";
import { Vector2 } from "./physics/Vector2.js";
import { createRenderer } from "./renderer.js";
import { createLoop } from "./loop.js";

const canvas = document.getElementById("gameCanvas");
const renderer = createRenderer(canvas);
const input = createInput();

const world = new World();

// 1. Создаем и спавним корабль в центре экрана
const ship = new Ship(renderer.width / 2, renderer.height / 2);
world.spawn(ship);

// 2. Спавним несколько астероидов для проверки
for (let i = 0; i < 4; i++) {
  const ax = Math.random() * renderer.width;
  const ay = Math.random() * renderer.height;
  world.spawn(new Asteroid(ax, ay, 25));
}

// Элементы HUD
const fpsEl = document.getElementById("fps");
const spsEl = document.getElementById("sps");
const frameTimeEl = document.getElementById("frameTime");

// 3. Запускаем игровой цикл
const loop = createLoop({
  update(dt) {
    // Управление поворотом корабля
    if (input.isDown("KeyA") || input.isDown("ArrowLeft")) {
      ship.angle -= ship.turnSpeed * dt;
    }
    if (input.isDown("KeyD") || input.isDown("ArrowRight")) {
      ship.angle += ship.turnSpeed * dt;
    }

    // Ускорение вперед (W или Стрелка вверх)
    if (input.isDown("KeyW") || input.isDown("ArrowUp")) {
      const force = Vector2.fromAngle(ship.angle, ship.acceleration * dt);
      ship.vel = ship.vel.add(force);
    }

    // Стельба по пробелу (Space)
    if (input.isDown("Space")) {
      const bullet = ship.fire();
      if (bullet) {
        world.spawn(bullet);
      }
    }

    // Обновляем мир (физика, коллизии, удаление мертвых)
    world.step(dt);
  },
  render(alpha) {
    renderer.clear();

    // Рендерим каждую сущность из мира
    for (const entity of world.entities.values()) {
      if (entity.kind === "ship") {
        renderer.drawShip(entity);
      } else if (entity.kind === "asteroid") {
        renderer.drawAsteroid(entity); // Убедись, что в renderer.js добавлен метод drawAsteroid и drawBullet
      } else if (entity.kind === "bullet") {
        renderer.drawBullet(entity);
      }
    }
  },
  onStats(stats) {
    fpsEl.textContent = stats.fps;
    spsEl.textContent = stats.sps;
    frameTimeEl.textContent = stats.frameTime.toFixed(2);
  },
});

loop.start();
