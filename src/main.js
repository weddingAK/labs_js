import { loadAll } from "./core/AssetLoader.js";
import { eventBus } from "./core/EventBus.js";
import { SoundManager } from "./audio/SoundManager.js";
import { Lobby } from "./ui/Lobby.js";
import { createInput } from "./input.js";
import { Ship } from "./entities/Ship.js";
import { Asteroid } from "./entities/Asteroid.js";
import { World } from "./entities/World.js";
import { Vector2 } from "./physics/Vector2.js";
import { createRenderer } from "./renderer.js";
import { createLoop } from "./loop.js";

const app = document.getElementById("app") || document.body;

// 1. Створюємо екран завантаження з прогрес-баром
const loadingEl = document.createElement("div");
loadingEl.innerHTML = `
  <div id="loader" style="position: absolute; inset: 0; background: #111; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20;">
    <h2>Loading Game Assets...</h2>
    <div style="width: 300px; height: 20px; border: 1px solid #fff; margin-top: 10px;">
      <div id="progress-bar" style="width: 0%; height: 100%; background: #00ffcc;"></div>
    </div>
  </div>
`;
app.appendChild(loadingEl);

const progressBar = loadingEl.querySelector("#progress-bar");
const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
const tempAudioCtx = new AudioCtxClass();

// Завантажуємо ассети через loadAll з Promise.all
loadAll("/src/assets/manifest.json", tempAudioCtx, (progress) => {
  progressBar.style.width = `${Math.round(progress * 100)}%`;
})
  .then((assets) => {
    loadingEl.remove();

    // Ініціалізуємо звук
    const soundManager = new SoundManager(assets.audio);

    // Слухаємо події через EventBus
    eventBus.addEventListener("fired", () => {
      soundManager.play("laser", 0.5);
    });

    // 2. Запускаємо Лобі
    const lobby = new Lobby(app);
    lobby.render();

    lobby.addEventListener("start-game", (e) => {
      const { playerName, room } = e.detail;
      soundManager.init(); // Активуємо AudioContext по жесту гравця (клік Join)
      startGame(assets, soundManager, room);
    });
  })
  .catch((err) => {
    console.error("Critical load error:", err);
    loadingEl.innerHTML = `<div style="color: red; text-align: center; margin-top: 50px;"><h2>Failed to load assets. Please refresh.</h2></div>`;
  });

function startGame(assets, soundManager, roomConfig) {
  const canvas =
    document.getElementById("gameCanvas") || document.createElement("canvas");
  canvas.id = "gameCanvas";
  if (!document.getElementById("gameCanvas")) app.appendChild(canvas);

  const renderer = createRenderer(canvas, assets);
  const input = createInput();
  const world = new World();

  const ship = new Ship(renderer.width / 2, renderer.height / 2);
  world.spawn(ship);

  for (let i = 0; i < 4; i++) {
    world.spawn(
      new Asteroid(
        Math.random() * renderer.width,
        Math.random() * renderer.height,
        25,
      ),
    );
  }

  const fpsEl = document.getElementById("fps");
  const spsEl = document.getElementById("sps");
  const frameTimeEl = document.getElementById("frameTime");

  const loop = createLoop({
    update(dt) {
      if (input.isDown("KeyA") || input.isDown("ArrowLeft"))
        ship.angle -= ship.turnSpeed * dt;
      if (input.isDown("KeyD") || input.isDown("ArrowRight"))
        ship.angle += ship.turnSpeed * dt;
      if (input.isDown("KeyW") || input.isDown("ArrowUp")) {
        ship.vel = ship.vel.add(
          Vector2.fromAngle(ship.angle, ship.acceleration * dt),
        );
      }

      if (input.isDown("Space")) {
        const bullet = ship.fire();
        if (bullet) {
          world.spawn(bullet);
          // Диспетчеризуємо подію стрільби через шину подій
          eventBus.dispatchEvent(new CustomEvent("fired"));
        }
      }

      world.step(dt);
    },
    render(alpha) {
      renderer.clear();
      for (const entity of world.entities.values()) {
        if (entity.kind === "ship") renderer.drawShip(entity);
        if (entity.kind === "asteroid") renderer.drawAsteroid(entity);
        if (entity.kind === "bullet") renderer.drawBullet(entity);
      }
    },
    onStats(stats) {
      if (fpsEl) fpsEl.textContent = stats.fps;
      if (spsEl) spsEl.textContent = stats.sps;
      if (frameTimeEl) frameTimeEl.textContent = stats.frameTime.toFixed(2);
    },
  });

  loop.start();
}
