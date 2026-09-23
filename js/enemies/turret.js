// turret.js - Torreta de Defensa Automatizada con Cañón Giratorio

class Turret {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.type = "turret";
    this.health = 5;
    this.toRemove = false;
    this.shootTimer = 60;
    this.angle = Math.PI;
    this.baseY = y;
    this.isGround = true;
  }

  update(player, level) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const dx = player.x + player.width / 2 - cx;
    const dy = player.y + player.height / 2 - cy;
    const dist = Math.hypot(dx, dy);
    this.angle = Math.atan2(dy, dx);

    this.shootTimer--;
    if (this.shootTimer <= 0 && dist < 520) {
      const speed = 5.0;
      level.addBullet(
        cx,
        cy,
        Math.cos(this.angle) * speed,
        Math.sin(this.angle) * speed,
        true,
        1,
        "#ff6600",
        5,
      );
      if (level.sound) level.sound.playEnemyShoot();
      this.shootTimer = 70 + Math.random() * 30;
    }
  }

  hit(damage = 1, level) {
    this.health -= damage;
    level.createExplosion(
      this.x + this.width / 2,
      this.y + this.height / 2,
      "#ffea00",
      6,
    );
    if (this.health <= 0) {
      this.toRemove = true;
      level.score += 250;
      level.createExplosion(
        this.x + this.width / 2,
        this.y + this.height / 2,
        "#ff3300",
        22,
      );
      level.addScreenShake(4);
      if (level.sound) level.sound.playExplosion();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    ctx.fillStyle = "#2b2d42";
    ctx.beginPath();
    ctx.arc(20, 22, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#454b66";
    ctx.beginPath();
    ctx.arc(20, 22, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff0033";
    ctx.beginPath();
    ctx.arc(20, 22, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(20, 22);
    ctx.rotate(this.angle);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, -5, 24, 10);
    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(22, -6, 5, 12);
    ctx.restore();
  }
}
