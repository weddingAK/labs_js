import { Vector2 } from "../physics/Vector2.js";

export class Entity {
  static #nextId = 1;
  #id;

  constructor(x, y, radius, kind) {
    this.#id = Entity.#nextId++;
    this.pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.radius = radius;
    this.kind = kind; // 'ship', 'bullet', 'asteroid', 'pickup'
    this.markedForRemoval = false;
  }

  get id() {
    return this.#id;
  }

  update(dt, world) {
    // Базовий рух за швидкістю
    this.pos = this.pos.add(this.vel.scale(dt));
  }

  onCollision(other, world) {
    // Перевизначається в дочірніх класах за потреби
  }
}
