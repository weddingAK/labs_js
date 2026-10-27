export class Pickup extends Entity {
  constructor(x, y, effectType = "heal") {
    super(x, y, 10, "pickup");
    this.effectType = effectType; // 'heal' або 'homing'
  }

  onCollision(other, world) {
    if (other.kind === "ship") {
      this.markedForRemoval = true;
      if (this.effectType === "heal") {
        // Логіка лікування через зовнішній сервіс або метод
      }
    }
  }
}
