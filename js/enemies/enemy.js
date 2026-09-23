// enemy.js - Soldados Enemigos Terrestres y Francotiradores (Sniper)

class Enemy {
  constructor(x, y, type = "soldier") {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 34;
    this.height = 54;
    this.direction = -1;
    this.shootTimer = Math.floor(Math.random() * 60) + 70;
    this.health = type === "sniper" ? 3 : 1;
    this.toRemove = false;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.28;
    this.animFrame = 0;
    this.onGround = false;
    this.homeX = x;
    this.patrolDir = Math.random() < 0.5 ? -1 : 1;
    this.patrolRange = 90 + Math.random() * 70;

    // Cuadros exactos del spritesheet ply2.png (mismo layout que el jugador)
    this.idleFrame = { sx: 28, sy: 23, sw: 32, sh: 41 };
    this.runFrames = [
      { sx: 99, sy: 18, sw: 27, sh: 46 },
      { sx: 166, sy: 22, sw: 40, sh: 41 },
      { sx: 241, sy: 23, sw: 37, sh: 41 },
      { sx: 319, sy: 23, sw: 31, sh: 41 },
      { sx: 388, sy: 23, sw: 34, sh: 41 },
      { sx: 454, sy: 22, sw: 40, sh: 39 },
    ];

    this.sprite = new Image();
    this.spriteLoaded = false;
    this.sprite.onload = () => {
      this.spriteLoaded = true;
    };
    this.sprite.src = "assets/img/ply2.png";
  }

  update(player, level) {
    const dx = player.x + player.width / 2 - (this.x + this.width / 2);
    const dist = Math.hypot(
      dx,
      player.y + player.height / 2 - (this.y + this.height / 2),
    );

    this.direction = dx < 0 ? -1 : 1;
    const seesPlayer = this.type === "sniper" ? dist < 620 : dist < 420;

    if (seesPlayer) {
      const chaseSpeed = this.type === "sniper" ? 0.9 : 1.25;
      const keepDistance = this.type === "sniper" ? 220 : 115;

      if (Math.abs(dx) > keepDistance + 12) {
        this.vx = this.direction * chaseSpeed;
      } else if (Math.abs(dx) < keepDistance - 18) {
        this.vx = this.direction * -chaseSpeed * 0.8;
      } else {
        this.vx = 0;
      }

      if (Math.abs(this.vx) > 0.05) this.animFrame += 0.18;
    } else {
      const patrolSpeed = this.type === "sniper" ? 0.45 : 0.7;
      if (Math.abs(this.x - this.homeX) > this.patrolRange) {
        this.patrolDir *= -1;
      }
      this.vx = this.patrolDir * patrolSpeed;
      if (Math.abs(this.vx) > 0.05) this.animFrame += 0.12;
    }

    this.vy += this.gravity;
    const prevX = this.x;
    const prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;
    this.onGround = false;

    const prevBottom = prevY + this.height;
    for (const plat of level.platforms) {
      if (
        this.x + this.width > plat.x + 2 &&
        this.x < plat.x + plat.w - 2 &&
        prevBottom <= plat.y + 6 &&
        this.y + this.height >= plat.y &&
        this.vy >= 0
      ) {
        this.y = plat.y - this.height;
        this.vy = 0;
        this.onGround = true;
        break;
      }
    }

    for (const obs of level.obstacles) {
      if (obs.type === "spikes") continue;
      const overlapX = this.x + this.width > obs.x && this.x < obs.x + obs.w;
      const overlapY = this.y + this.height > obs.y && this.y < obs.y + obs.h;
      if (!overlapX || !overlapY) continue;

      if (
        prevY + this.height <= obs.y + 8 &&
        this.y + this.height >= obs.y &&
        this.vy >= 0
      ) {
        this.y = obs.y - this.height;
        this.vy = 0;
        this.onGround = true;
      } else if (
        prevX + this.width <= obs.x + 4 &&
        this.x + this.width > obs.x
      ) {
        this.x = obs.x - this.width;
        this.vx *= -0.25;
      } else if (prevX >= obs.x + obs.w - 4 && this.x < obs.x + obs.w) {
        this.x = obs.x + obs.w;
        this.vx *= -0.25;
      }
    }

    this.shootTimer--;
    if (this.shootTimer <= 0) {
      if (dist < 550 && Math.abs(dx) > 40) {
        this.shootAtPlayer(player, level);
      }
      this.shootTimer =
        this.type === "sniper"
          ? 110 + Math.random() * 40
          : 80 + Math.random() * 50;
    }

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

    if (this.y > level.mapHeight + 100) {
      this.toRemove = true;
    }
  }

  shootAtPlayer(player, level) {
    const startX = this.direction === 1 ? this.x + this.width : this.x;
    const startY = this.y + 20;

    const targetX = player.x + player.width / 2;
    const targetY = player.y + player.height / 2;

    const angle = Math.atan2(targetY - startY, targetX - startX);
    const bulletSpeed = this.type === "sniper" ? 6.2 : 4.4;
    const bvx = Math.cos(angle) * bulletSpeed;
    const bvy = Math.sin(angle) * bulletSpeed;

    level.addBullet(startX, startY, bvx, bvy, true, 1, "#ff1100", 4.5);
    if (level.sound) level.sound.playEnemyShoot();
  }

  hit(damage = 1, level) {
    this.health -= damage;
    level.createExplosion(
      this.x + this.width / 2,
      this.y + this.height / 2,
      "#ff4400",
      10,
    );
    if (this.health <= 0) {
      this.toRemove = true;
      const points = this.type === "sniper" ? 300 : 150;
      level.score += points;
      if (level.sound) level.sound.playExplosion();
      level.createExplosion(
        this.x + this.width / 2,
        this.y + this.height / 2,
        "#ffea00",
        20,
      );
      level.addScreenShake(3);

      if (Math.random() < 0.35) {
        level.emeralds.push(new Emerald(this.x, this.y));
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Sombra anclada a la superficie
    const centerX = Math.floor(this.x + this.width / 2);
    const bottomY = Math.floor(this.y + this.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(centerX, bottomY - 2, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    if (this.direction === -1) {
      ctx.scale(-1, 1);
      ctx.translate(-this.width, 0);
    }

    if (this.spriteLoaded) {
      const moving = Math.abs(this.vx) > 0.05;
      const f = moving
        ? this.runFrames[Math.floor(this.animFrame) % this.runFrames.length]
        : this.idleFrame;

      const drawH = this.height;
      const drawW = f.sw * (drawH / f.sh);
      const dx = this.width / 2 - drawW / 2;
      const dy = this.height - drawH;
      ctx.drawImage(this.sprite, f.sx, f.sy, f.sw, f.sh, dx, dy, drawW, drawH);
    } else {
      ctx.fillStyle = this.type === "sniper" ? "#e63946" : "#8338ec";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(18, 12, 16, 6);
    }

    ctx.restore();
  }
}
