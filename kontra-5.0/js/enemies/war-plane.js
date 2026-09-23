// war-plane.js - Avión de combate en el fondo del escenario

class WarPlane {
  constructor(canvasWidth) {
    this.reset(canvasWidth);
  }

  reset(canvasWidth) {
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.x = this.direction === 1 ? -120 : canvasWidth + 120;
    this.y = Math.random() * 80 + 35;
    this.speed = Math.random() * 2.2 + 2.8;
    this.trail = [];
  }

  update(canvasWidth) {
    this.x += this.direction * this.speed;
    if (Math.random() < 0.4) {
      this.trail.push({
        x: this.x - this.direction * 15,
        y: this.y + (Math.random() - 0.5) * 3,
        alpha: 0.6,
        size: 3,
      });
    }

    for (const t of this.trail) {
      t.alpha -= 0.012;
      t.size += 0.15;
    }
    this.trail = this.trail.filter((t) => t.alpha > 0);

    if (
      (this.direction === 1 && this.x > canvasWidth + 250) ||
      (this.direction === -1 && this.x < -250)
    ) {
      this.reset(canvasWidth);
    }
  }

  draw(ctx) {
    ctx.save();
    for (const t of this.trail) {
      ctx.fillStyle = `rgba(200, 200, 200, ${t.alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#18202c";
    ctx.translate(this.x, this.y);
    if (this.direction === -1) ctx.scale(-1, 1);

    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-12, -4);
    ctx.lineTo(-24, -14);
    ctx.lineTo(-18, -2);
    ctx.lineTo(-28, 0);
    ctx.lineTo(-18, 2);
    ctx.lineTo(-24, 14);
    ctx.lineTo(-12, 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ff3300";
    ctx.fillRect(-30, -1.5, 4, 3);
    ctx.restore();
  }
}
