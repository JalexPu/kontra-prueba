// particle.js - Sistema de Partículas para Explosiones, Humo y Efectos Visuales

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 0.8;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.size = Math.random() * 3.5 + 2;
    this.alpha = 1;
    this.fade = Math.random() * 0.035 + 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.fade;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}
