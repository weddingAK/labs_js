export class SoundManager {
  constructor(audioBuffers) {
    this.audioCtx = null;
    this.buffers = audioBuffers;
    this.enabled = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    this.enabled = true;
  }

  play(name, volume = 1.0) {
    if (!this.enabled || !this.audioCtx || !this.buffers[name]) return;

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.buffers[name];

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    source.start(0);
  }
}
