import { Entity } from "./Entity.js";
import { Vector2 } from "../physics/Vector2.js";
import { Bullet } from "./Bullet.js";

export class Ship extends Entity {
  #hp = 100;
  #respawnTimer = 0;
  isDead = false;

  constructor(x, y) {
    super(x, y, 15, "ship");
    this.angle = 0;
    this.turnSpeed = Math.PI * 1.5;
    this.acceleration = 300;
    this.friction = 0.98;
  }

  get hp() {
    return this.#hp;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.#hp -= amount;
    if (this.#hp <= 0) {
      this.#hp = 0;
      this.isDead = true;
      this.markedForRemoval = true; // Забираємо зі світу на час вибуху/респауну
    }
  }

  fire() {
    if (this.isDead) return null;
    // Стрільба з носа корабля
    const noseOffset = Vector2.fromAngle(this.angle, 20);
    const spawnPos = this.pos.add(noseOffset);
    const bulletVel = Vector2.fromAngle(this.angle, 500).add(
      this.vel.scale(0.5),
    );

    return new Bullet(spawnPos.x, spawnPos.y, bulletVel);
  }

  update(dt, world) {
    if (this.isDead) return;

    // Позиція оновлюється через базовий клас або кастомно
    this.vel = this.vel.scale(Math.pow(this.friction, dt * 60));
    this.pos = this.pos.add(this.vel.scale(dt));

    // Screen wrapping (арена 800x600)
    if (this.pos.x < 0) this.pos.x += 800;
    if (this.pos.x > 800) this.pos.x -= 800;
    if (this.pos.y < 0) this.pos.y += 600;
    if (this.pos.y > 600) this.pos.y -= 600;
  }
}
