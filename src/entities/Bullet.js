import { Entity } from "./Entity.js";

export class Bullet extends Entity {
  constructor(x, y, velocity) {
    super(x, y, 3, "bullet");
    this.vel = velocity;
    this.ttl = 2.0; // Живе 2 секунди
  }

  update(dt, world) {
    super.update(dt, world);
    this.ttl -= dt;
    if (this.ttl <= 0) {
      this.markedForRemoval = true;
    }

    // Wrap around
    if (this.pos.x < 0) this.pos.x += 800;
    if (this.pos.x > 800) this.pos.x -= 800;
    if (this.pos.y < 0) this.pos.y += 600;
    if (this.pos.y > 600) this.pos.y -= 600;
  }

  onCollision(other) {
    if (other.kind === "asteroid" || other.kind === "ship") {
      this.markedForRemoval = true;
    }
  }
}
