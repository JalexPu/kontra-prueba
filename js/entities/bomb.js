// bomb.js - Entidad de Bomba de Área destructiva (Estilo Contra)

class Bomb {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = 0.35;
    this.timer = 60;
    this.toRemove = false;
    this.exploded = false;
    this.radius = 90;
  }

  update(level) {
    if (this.exploded) return;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99;

    for (const plat of level.platforms) {
      if (
        this.x > plat.x &&
        this.x < plat.x + plat.w &&
        this.y > plat.y &&
        this.y < plat.y + plat.h &&
        this.vy > 0
      ) {
        this.y = plat.y;
        this.vy = 0;
        this.vx *= 0.7;
      }
    }

    this.timer--;
    if (this.timer <= 0) this.explode(level);
  }

  explode(level) {
    this.exploded = true;
    this.toRemove = true;
    level.createExplosion(this.x, this.y, "#ffffff", 40);
    level.createExplosion(this.x, this.y, "#ffea00", 30);
    level.createExplosion(this.x, this.y, "#ff6600", 24);
    level.addScreenShake(14);
    if (level.sound) level.sound.playExplosion();

    // Daño en área a todos los enemigos (y jefe)
    const cx = this.x;
    const cy = this.y;
    for (const e of level.enemies) {
      const ex = e.x + e.width / 2;
      const ey = e.y + e.height / 2;
      if (Math.hypot(ex - cx, ey - cy) < this.radius) {
        e.hit(3, level);
      }
    }
    if (level.boss && level.boss.isActive && !level.boss.isDying) {
      const bx = level.boss.x + level.boss.width / 2;
      const by = level.boss.y + level.boss.height / 2;
      if (Math.hypot(bx - cx, by - cy) < this.radius) {
        level.boss.hit(4, level);
      }
    }
  }

  draw(ctx) {
    if (this.exploded) return;
    ctx.save();
    // Pulso de peligro creciente
    const pulse = 4 + Math.sin(this.timer * 0.8) * 2;
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle =
      Math.floor(this.timer / 4) % 2 === 0 ? "#ff3300" : "#ffea00";
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
