// heart-item.js - Ítem de Corazón / Salud (Recupera vida del soldado)

class HeartItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 22;
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
    const glow = ctx.createRadialGradient(
      this.x + this.width / 2,
      this.y + this.height / 2,
      2,
      this.x + this.width / 2,
      this.y + this.height / 2,
      22,
    );
    glow.addColorStop(0, "rgba(255, 0, 85, 0.5)");
    glow.addColorStop(1, "rgba(255, 0, 85, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      22,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.translate(this.x + this.width / 2, this.y + 3);
    const size = 16;
    ctx.fillStyle = "#ff0055";
    const tch = size * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, tch);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, tch);
    ctx.bezierCurveTo(
      -size / 2,
      (size + tch) / 2,
      0,
      (size + tch) / 2,
      0,
      size,
    );
    ctx.bezierCurveTo(
      0,
      (size + tch) / 2,
      size / 2,
      (size + tch) / 2,
      size / 2,
      tch,
    );
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, tch);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
