// mini-boss.js - Mini-Jefe: Torreta Pesada Blindada (Glaciar / Sector 3)

class MiniBoss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 90;
    this.type = "miniboss";
    this.maxHealth = 40;
    this.health = this.maxHealth;
    this.toRemove = false;
    this.shootTimer = 80;
    this.burstTimer = 220;
    this.angle = Math.PI;
    this.damageFlashTimer = 0;
  }

  update(player, level) {
    if (this.damageFlashTimer > 0) this.damageFlashTimer--;
    const cx = this.x + this.width / 2;
    const cy = this.y + 30;
    const dx = player.x + player.width / 2 - cx;
    const dy = player.y + player.height / 2 - cy;
    this.angle = Math.atan2(dy, dx);

    this.shootTimer--;
    if (this.shootTimer <= 0) {
      const speed = 5.4;
      level.addBullet(
        cx,
        cy,
        Math.cos(this.angle) * speed,
        Math.sin(this.angle) * speed,
        true,
        1,
        "#ff3300",
        6,
      );
      if (level.sound) level.sound.playBossShoot();
      this.shootTimer = 55;
    }

    this.burstTimer--;
    if (this.burstTimer <= 0) {
      for (let i = -2; i <= 2; i++) {
        const a = this.angle + i * 0.2;
        const speed = 4.6;
        level.addBullet(
          cx,
          cy,
          Math.cos(a) * speed,
          Math.sin(a) * speed,
          true,
          1,
          "#ff6600",
          5,
        );
      }
      if (level.sound) level.sound.playBossShoot();
      level.addScreenShake(3);
      this.burstTimer = 200;
    }
  }

  hit(damage = 1, level) {
    this.health -= damage;
    this.damageFlashTimer = 5;
    level.createExplosion(this.x + this.width / 2, this.y + 40, "#ffea00", 6);
    if (level.sound) level.sound.playBossHit();
    if (this.health <= 0) {
      this.toRemove = true;
      level.score += 3000;
      for (let i = 0; i < 3; i++) {
        level.createExplosion(
          this.x + this.width / 2,
          this.y + 40,
          i % 2 === 0 ? "#ff3300" : "#ffea00",
          24,
        );
      }
      level.addScreenShake(14);
      if (level.sound) level.sound.playBossDefeat();
      level.emeralds.push(new Emerald(this.x, this.y + 20));
      level.heartItems.push(new HeartItem(this.x + 30, this.y + 30));
      // Marca de sector completado
      level.miniBossDefeated = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));

    // Base blindada
    ctx.fillStyle = this.damageFlashTimer > 0 ? "#ffffff" : "#232b3d";
    ctx.fillRect(0, 40, this.width, 50);
    ctx.strokeStyle = "#4f6488";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 40, this.width, 50);

    // Franjas de peligro
    ctx.fillStyle = "#ffcc00";
    for (let i = 8; i < this.width - 8; i += 16) {
      ctx.fillRect(i, 60, 6, 20);
    }

    // Cúpula
    ctx.fillStyle = this.damageFlashTimer > 0 ? "#ffffff" : "#2f3b52";
    ctx.beginPath();
    ctx.arc(this.width / 2, 40, 32, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "#6b7fa3";
    ctx.stroke();

    // Cañón rotatorio
    ctx.translate(this.width / 2, 30);
    ctx.rotate(this.angle);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, -7, 42, 14);
    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(38, -9, 8, 18);
    ctx.fillStyle = "#ffea00";
    ctx.fillRect(6, -3, 24, 6);

    ctx.restore();

    // Barra de vida del mini-jefe
    const barW = 70;
    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.save();
    ctx.fillStyle = "rgba(10, 15, 26, 0.9)";
    ctx.fillRect(this.x, this.y - 12, barW, 7);
    ctx.fillStyle = "#ff6600";
    ctx.fillRect(this.x + 1, this.y - 11, (barW - 2) * ratio, 5);
    ctx.restore();
  }
}
