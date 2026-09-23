// bomb-pickup.js - Ítem de Munición de Bombas

class BombPickup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 20;
    this.height = 20;
    this.toRemove = false;
    this.floatAngle = Math.random() * Math.PI * 2;
  }

  update() {
    this.floatAngle += 0.06;
    this.y = this.baseY + Math.sin(this.floatAngle) * 5;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(this.x + 10, this.y + 11, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffea00";
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = "center";
    ctx.fillText("B", this.x + 10, this.y + 15);
    ctx.strokeStyle = "#ff6600";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y + 2);
    ctx.lineTo(this.x + 14, this.y - 4);
    ctx.stroke();
    ctx.restore();
  }
}
