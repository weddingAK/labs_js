import { Entity } from "./Entity.js";
import { Vector2 } from "../physics/Vector2.js";

export class Asteroid extends Entity {
  constructor(x, y, radius = 30) {
    super(x, y, radius, "asteroid");
    const randomAngle = Math.random() * Math.PI * 2;
    this.vel = Vector2.fromAngle(randomAngle, 50 + Math.random() * 50);
  }

  update(dt, world) {
    super.update(dt, world);
    if (this.pos.x < 0) this.pos.x += 800;
    if (this.pos.x > 800) this.pos.x -= 800;
    if (this.pos.y < 0) this.pos.y += 600;
    if (this.pos.y > 600) this.pos.y -= 600;
  }

  onCollision(other, world) {
    if (other.kind === "bullet") {
      this.markedForRemoval = true;
    }
  }
}
