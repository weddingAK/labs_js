export async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = new Error(`HTTP error! Status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function retryWithBackoff(fn, retries = 3, delay = 500) {
  try {
    return await fn();
  } catch (error) {
    // Не робимо ретрай на клієнтські помилки 4xx (окрім 408/429 за бажанням, але класичні 404 тощо - одразу кидаємо)
    if (
      error.status &&
      error.status >= 400 &&
      error.status < 500 &&
      error.status !== 408 &&
      error.status !== 429
    ) {
      throw error;
    }
    if (retries <= 0) throw error;

    // Exponential backoff + jitter
    const jitter = Math.random() * 200;
    const nextDelay = delay * 2 + jitter;
    await new Promise((resolve) => setTimeout(resolve, nextDelay));
    return retryWithBackoff(fn, retries - 1, nextDelay);
  }
}

export async function loadImage(url, signal) {
  return retryWithBackoff(async () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const onAbort = () => {
        img.src = "";
        reject(new DOMException("Aborted", "AbortError"));
      };

      if (signal?.aborted) return onAbort();
      signal?.addEventListener("abort", onAbort, { once: true });

      img.onload = () => {
        signal?.removeEventListener("abort", onAbort);
        resolve(img);
      };
      img.onerror = (err) => {
        signal?.removeEventListener("abort", onAbort);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });
  });
}

export async function loadAudio(url, audioCtx, signal) {
  return retryWithBackoff(async () => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      const err = new Error(`HTTP error loading audio: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    const arrayBuffer = await response.arrayBuffer();
    return audioCtx.decodeAudioData(arrayBuffer);
  });
}

export async function loadAll(manifestUrl, audioCtx, onProgress, signal) {
  const manifest = await fetchJson(manifestUrl, signal);
  const loadedAssets = { images: {}, audio: {} };

  const imageEntries = Object.entries(manifest.images || {});
  const audioEntries = Object.entries(manifest.audio || {});

  const totalItems = imageEntries.length + audioEntries.length;
  let completedItems = 0;

  const updateProgress = () => {
    completedItems++;
    if (onProgress) {
      onProgress(completedItems / totalItems);
    }
  };

  // Використовуємо Promise.all для паралельного завантаження (concurrent)
  const imagePromises = imageEntries.map(async ([key, url]) => {
    loadedAssets.images[key] = await loadImage(url, signal);
    updateProgress();
  });

  const audioPromises = audioEntries.map(async ([key, url]) => {
    loadedAssets.audio[key] = await loadAudio(url, audioCtx, signal);
    updateProgress();
  });

  await Promise.all([...imagePromises, ...audioPromises]);
  return loadedAssets;
}
