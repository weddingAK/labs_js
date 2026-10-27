export function createLoop({ update, render, onStats }) {
  const TIME_STEP = 1 / 60; // Фіксований крок симуляції (60 разів/с)
  let accumulator = 0;
  let lastTime = performance.now();

  let frameCount = 0;
  let stepCount = 0;
  let lastFpsUpdate = lastTime;

  let currentFps = 0;
  let currentSps = 0;
  let currentFrameTime = 0;

  function loop(timestamp) {
    let frameTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Захист від занадто великого стрибка (якщо вкладка була згорнута)
    if (frameTime > 0.25) {
      frameTime = 0.25;
    }

    currentFrameTime = frameTime * 1000;
    accumulator += frameTime;

    let stepsThisFrame = 0;
    while (accumulator >= TIME_STEP) {
      update(TIME_STEP);
      accumulator -= TIME_STEP;
      stepCount++;
      stepsThisFrame++;
    }

    // Рендер з інтерполяцією залишку в акумуляторі
    const alpha = accumulator / TIME_STEP;
    render(alpha);

    frameCount++;

    // Підрахунок FPS та SPS кожну секунду
    if (timestamp - lastFpsUpdate >= 1000) {
      currentFps = frameCount;
      currentSps = stepCount;
      frameCount = 0;
      stepCount = 0;
      lastFpsUpdate = timestamp;

      if (onStats) {
        onStats({
          fps: currentFps,
          sps: currentSps,
          frameTime: currentFrameTime,
        });
      }
    }

    requestAnimationFrame(loop);
  }

  return {
    start() {
      lastTime = performance.now();
      lastFpsUpdate = lastTime;
      requestAnimationFrame(loop);
    },
  };
}
