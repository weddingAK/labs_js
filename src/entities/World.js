export class World {
  constructor() {
    this.entities = new Map();
  }

  spawn(entity) {
    this.entities.set(entity.id, entity);
  }

  despawn(id) {
    this.entities.delete(id);
  }

  *ofKind(kind) {
    for (const entity of this.entities.values()) {
      if (entity.kind === kind) {
        yield entity;
      }
    }
  }

  step(dt) {
    // 1. Оновлення всіх сутностей
    for (const entity of this.entities.values()) {
      entity.update(dt, this);
    }

    // 2. Перевірка колізій (наївний O(n²))
    const allEntities = Array.from(this.entities.values());
    for (let i = 0; i < allEntities.length; i++) {
      for (let j = i + 1; j < allEntities.length; j++) {
        const a = allEntities[i];
        const b = allEntities[j];

        const dist = a.pos.sub(b.pos).length();
        if (dist < a.radius + b.radius) {
          a.onCollision(b, this);
          b.onCollision(a, this);

          // Простий ефект зіткнення для куль та астероїдів
          if (a.kind === "bullet" && b.kind === "asteroid") {
            a.markedForRemoval = true;
            b.markedForRemoval = true;
          }
          if (a.kind === "ship" && b.kind === "asteroid") {
            a.takeDamage(25);
            b.markedForRemoval = true;
          }
        }
      }
    }

    // 3. Sweep (очищення мертвих наприкінці кроку)
    for (const [id, entity] of this.entities.entries()) {
      if (entity.markedForRemoval) {
        this.despawn(id);
      }
    }
  }
}
