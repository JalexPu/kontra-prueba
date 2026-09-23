// boss-robot.js - Jefe Final Robot Autómata (OMEGA PRIME)

class BossRobot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetY = 160;
    this.width = 96;
    this.height = 86;
    this.maxHealth = 90;
    this.health = this.maxHealth;
    this.vx = 0;
    this.vy = 0;
    this.toRemove = false;
    this.isActive = false;
    this.isDying = false;
    this.deathTimer = 0;
    this.isBerserk = false;

    // Animación y dirección
    this.hoverTime = 0;
    this.damageFlashTimer = 0;
    this.corePulse = 0;
    this.eyeX = 0;
    this.armAngle = 0;
    this.direction = -1;

    // Máquina de estados de combate
    this.state = "HOVER";
    this.stateTimer = 0;
    this.attackCooldown = 50;
    this.specialCooldown = 140;
    this.dashCooldown = 220;
  }

  update(player, level) {
    this.hoverTime += 0.05;
    this.corePulse += 0.09;
    if (this.damageFlashTimer > 0) this.damageFlashTimer--;

    // Activación de Fase Berserk
    if (!this.isBerserk && this.health <= this.maxHealth * 0.5) {
      this.isBerserk = true;
      level.addScreenShake(8);
      level.createExplosion(
        this.x + this.width / 2,
        this.y + this.height / 2,
        "#ff0033",
        25,
      );
      if (level.sound) level.sound.playBossCharge();
    }

    // Secuencia de Destrucción
    if (this.isDying) {
      this.deathTimer++;
      this.vx *= 0.85;
      this.vy *= 0.85;
      this.x += this.vx;
      this.y += this.vy;

      if (this.deathTimer % 11 === 0) {
        const exX = this.x + Math.random() * this.width;
        const exY = this.y + Math.random() * this.height;
        level.createExplosion(
          exX,
          exY,
          Math.random() > 0.4 ? "#ff3300" : "#ffea00",
          16,
        );
        level.addScreenShake(6);
        if (level.sound) level.sound.playExplosion();
      }

      if (Math.random() < 0.6) {
        level.particles.push(
          new Particle(
            this.x + Math.random() * this.width,
            this.y + Math.random() * this.height,
            "#555555",
          ),
        );
      }

      if (this.deathTimer >= 130) {
        this.toRemove = true;
        level.createExplosion(
          this.x + this.width / 2,
          this.y + this.height / 2,
          "#ff3300",
          40,
        );
        level.createExplosion(
          this.x + this.width / 2,
          this.y + this.height / 2,
          "#ffea00",
          30,
        );
        level.createExplosion(
          this.x + this.width / 2,
          this.y + this.height / 2,
          "#00f5d4",
          25,
        );
        level.addScreenShake(18);
        if (level.sound) level.sound.playBossDefeat();

        for (let i = -2; i <= 2; i++) {
          level.emeralds.push(
            new Emerald(this.x + this.width / 2 + i * 36, this.y + 20),
          );
        }
        level.score += 10000;
        level.onBossDefeated();
      }
      return;
    }

    if (!this.isActive) return;

    // Rastreo del jugador
    const pCenterX = player.x + player.width / 2;
    const pCenterY = player.y + player.height / 2;
    const bCenterX = this.x + this.width / 2;
    const bCenterY = this.y + this.height / 2;

    const dx = pCenterX - bCenterX;
    const dy = pCenterY - bCenterY;
    this.armAngle = Math.atan2(dy, dx);
    this.direction = dx < 0 ? -1 : 1;
    this.eyeX = Math.max(-8, Math.min(8, (dx / 320) * 8));

    if (this.health < this.maxHealth * 0.5 && Math.random() < 0.45) {
      level.particles.push(
        new Particle(
          this.x + (Math.random() * 0.6 + 0.2) * this.width,
          this.y + Math.random() * 0.5 * this.height,
          this.isBerserk ? "#ff1100" : "#444444",
        ),
      );
    }

    if (Math.random() < 0.5) {
      const tx1 = this.x + 22;
      const tx2 = this.x + this.width - 22;
      const ty = this.y + this.height - 4;
      level.particles.push(
        new Particle(tx1 + (Math.random() - 0.5) * 6, ty, "#ff6600"),
      );
      level.particles.push(
        new Particle(tx2 + (Math.random() - 0.5) * 6, ty, "#ff6600"),
      );
    }

    this.stateTimer++;
    const arenaMinX = 250;
    const arenaMaxX = 750;
    const arenaBaseY = 150;

    switch (this.state) {
      case "HOVER": {
        this.targetY = arenaBaseY + Math.sin(this.hoverTime * 1.8) * 45;
        let targetX = pCenterX + (this.direction === -1 ? 260 : -260);
        targetX = Math.max(arenaMinX, Math.min(arenaMaxX, targetX));

        this.vx += (targetX - this.x) * 0.024;
        this.vy += (this.targetY - this.y) * 0.045;
        this.vx *= 0.88;
        this.vy *= 0.88;

        this.attackCooldown--;
        if (this.attackCooldown <= 0) {
          this.firePlasma(level, pCenterX, pCenterY);
          this.attackCooldown = this.isBerserk ? 30 : 50;
        }

        this.specialCooldown--;
        if (this.specialCooldown <= 0) {
          this.fireSpread(level, pCenterX, pCenterY);
          this.specialCooldown = this.isBerserk ? 90 : 140;
        }

        this.dashCooldown--;
        if (this.dashCooldown <= 0 && Math.abs(dx) > 180) {
          this.state = "DASH";
          this.stateTimer = 0;
          this.dashCooldown = this.isBerserk ? 160 : 230;
          if (level.sound) level.sound.playBossCharge();
          level.addScreenShake(5);
        }
        break;
      }

      case "DASH": {
        const dashDir = dx < 0 ? -1 : 1;
        const dashSpeed = this.isBerserk ? 7.8 : 6.0;
        this.vx = dashDir * dashSpeed;
        this.vy = (pCenterY - (this.y + this.height / 2)) * 0.05;

        level.particles.push(
          new Particle(
            dashDir === -1 ? this.x + this.width : this.x,
            this.y + this.height * 0.6,
            "#00f5d4",
          ),
        );

        if (
          player.invulnerableTimer === 0 &&
          !player.isDead &&
          player.x + player.width > this.x &&
          player.x < this.x + this.width &&
          player.y + player.height > this.y &&
          player.y < this.y + this.height
        ) {
          player.takeDamage(level);
          this.state = "RETREAT";
          this.stateTimer = 0;
        }

        if (this.stateTimer > 52 || this.x < 120 || this.x > 840) {
          this.state = "RETREAT";
          this.stateTimer = 0;
          this.fireSpread(level, pCenterX, pCenterY);
        }
        break;
      }

      case "RETREAT": {
        const retreatDir = this.direction === -1 ? 1 : -1;
        this.vx = retreatDir * (this.isBerserk ? 4.6 : 3.4);
        this.vy = -3.2;

        if (this.stateTimer > 38 || this.y < 90) {
          this.state = "HOVER";
          this.stateTimer = 0;
        }
        break;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 80) this.x = 80;
    if (this.x > 800) this.x = 800;
    if (this.y < 50) this.y = 50;
    if (this.y > 310) this.y = 310;
  }

  firePlasma(level, targetX, targetY) {
    const cannonOffsets = [
      { x: this.x + 8, y: this.y + 42 },
      { x: this.x + this.width - 8, y: this.y + 42 },
    ];

    for (const can of cannonOffsets) {
      const angle = Math.atan2(targetY - can.y, targetX - can.x);
      const speed = this.isBerserk ? 7.2 : 6.0;
      level.addBullet(
        can.x,
        can.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        true,
        1,
        "#ff0033",
        5.5,
      );
      level.createExplosion(can.x, can.y, "#ffea00", 4);
    }

    if (level.sound) level.sound.playBossShoot();
    level.addScreenShake(2);
  }

  fireSpread(level, targetX, targetY) {
    const cx = this.x + this.width / 2;
    const cy = this.y + 46;
    const baseAngle = Math.atan2(targetY - cy, targetX - cx);
    const count = this.isBerserk ? 7 : 5;
    const spreadStep = 0.22;
    const startAngle = baseAngle - ((count - 1) / 2) * spreadStep;

    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * spreadStep;
      level.addBullet(
        cx,
        cy,
        Math.cos(angle) * 4.4,
        Math.sin(angle) * 4.4,
        true,
        1,
        "#ff6600",
        5.0,
      );
    }

    level.createExplosion(cx, cy, "#00f5d4", 8);
    if (level.sound) level.sound.playBossShoot();
    level.addScreenShake(3);
  }

  hit(damage = 1, level) {
    if (!this.isActive || this.isDying) return;
    this.health -= damage;
    this.damageFlashTimer = 5;
    level.createExplosion(
      this.x + this.width / 2,
      this.y + this.height / 2,
      "#ffea00",
      6,
    );
    level.addScreenShake(2);
    if (level.sound) level.sound.playBossHit();

    if (this.health <= 0) {
      this.health = 0;
      this.isDying = true;
      this.deathTimer = 0;
      level.addScreenShake(10);
      if (level.sound) level.sound.playBossDefeat();
    }
  }

  draw(ctx) {
    if (typeof BossRenderer !== "undefined") {
      BossRenderer.draw(this, ctx);
    }
  }
}
