// drone.js - Dron Volador Autónomo de Combate

class Drone {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 36;
    this.height = 26;
    this.type = "drone";
    this.health = 2;
    this.toRemove = false;
    this.shootTimer = 90;
    this.hover = Math.random() * Math.PI * 2;
    this.vx = 0;
    this.speed = 1.4;
  }

  update(player, level) {
    this.hover += 0.06;
    const pcx = player.x + player.width / 2;
    const cx = this.x + this.width / 2;
    const dx = pcx - cx;

    if (Math.abs(dx) > 30) this.vx += dx > 0 ? 0.05 : -0.05;
    this.vx = Math.max(-this.speed, Math.min(this.speed, this.vx));
    this.vx *= 0.96;
    this.x += this.vx;
    this.y = this.baseY + Math.sin(this.hover) * 22;

    this.shootTimer--;
    if (this.shootTimer <= 0) {
      const dy = player.y + player.height / 2 - (this.y + this.height / 2);
      const angle = Math.atan2(dy, dx);
      const speed = 4.6;
      level.addBullet(
        cx,
        this.y + this.height,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        true,
        1,
        "#ff0055",
        4.5,
      );
      if (level.sound) level.sound.playEnemyShoot();
      this.shootTimer = 100 + Math.random() * 50;
    }

    // Daño por contacto
    if (
      !player.isDead &&
      player.invulnerableTimer === 0 &&
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    ) {
      player.takeDamage(level);
    }
  }

  hit(damage = 1, level) {
    this.health -= damage;
    level.createExplosion(
      this.x + this.width / 2,
      this.y + this.height / 2,
      "#ffea00",
      8,
    );
    if (this.health <= 0) {
      this.toRemove = true;
      level.score += 200;
      level.createExplosion(
        this.x + this.width / 2,
        this.y + this.height / 2,
        "#ff6600",
        20,
      );
      level.addScreenShake(3);
      if (level.sound) level.sound.playExplosion();
      if (Math.random() < 0.3) {
        level.emeralds.push(new Emerald(this.x, this.y));
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    // Hélices
    ctx.strokeStyle = "rgba(200, 220, 255, 0.6)";
    ctx.lineWidth = 2;
    const spin = Math.sin(performance.now() * 0.03) * 10;
    ctx.beginPath();
    ctx.moveTo(-spin + 8, 3);
    ctx.lineTo(spin + 8, 3);
    ctx.moveTo(-spin + 28, 3);
    ctx.lineTo(spin + 28, 3);
    ctx.stroke();

    // Cuerpo
    ctx.fillStyle = "#26344d";
    ctx.beginPath();
    ctx.ellipse(18, 15, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4f6488";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ojo
    const pulse = Math.sin(this.hover * 4) > 0 ? "#ff0033" : "#aa0022";
    ctx.fillStyle = pulse;
    ctx.beginPath();
    ctx.arc(18, 15, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
