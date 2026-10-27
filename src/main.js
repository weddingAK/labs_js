import { createInput } from "./input.js";
import { createShip, integrate } from "./physics.js";
import { createRenderer } from "./renderer.js";
import { createLoop } from "./loop.js";

const canvas = document.getElementById("gameCanvas");
const renderer = createRenderer(canvas);
const input = createInput();
const ship = createShip(renderer.width / 2, renderer.height / 2);

// Елементи HUD
const fpsEl = document.getElementById("fps");
const spsEl = document.getElementById("sps");
const frameTimeEl = document.getElementById("frameTime");

const loop = createLoop({
  update(dt) {
    integrate(ship, input, dt);
  },
  render(alpha) {
    renderer.clear();
    renderer.drawShip(ship);
  },
  onStats(stats) {
    fpsEl.textContent = stats.fps;
    spsEl.textContent = stats.sps;
    frameTimeEl.textContent = stats.frameTime.toFixed(2);
  },
});

loop.start();
