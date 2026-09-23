// player.js - Lógica, Físicas y Control del Soldado Protagonista

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 54;

    const cfg = typeof GameConfig !== "undefined" ? GameConfig.player : null;

    // Físicas de movimiento
    this.vx = 0;
    this.vy = 0;
    this.maxSpeed = cfg ? cfg.speed : 2.05;
    this.accel = cfg ? cfg.accel : 0.36;
    this.friction = cfg ? cfg.friction : 0.86;
    this.jumpForce = cfg ? cfg.jumpForce : -10.3;
    this.gravity = cfg ? cfg.gravity : 0.42;
    this.onGround = false;
    this.coyoteTime = 0;
    this.jumpBuffer = 0;

    // Estado y orientación
    this.direction = 1;
    this.isCrouching = false;
    this.aimAngle = 0;
    this.rollAngle = 0;
    this.runDustTimer = 0;

    // Cuadros del spritesheet ply1.png
    this.runFrames = [
      { sx: 99, sy: 18, sw: 27, sh: 46 },
      { sx: 166, sy: 22, sw: 40, sh: 41 },
      { sx: 241, sy: 23, sw: 37, sh: 41 },
      { sx: 319, sy: 23, sw: 31, sh: 41 },
      { sx: 388, sy: 23, sw: 34, sh: 41 },
      { sx: 454, sy: 22, sw: 40, sh: 39 },
    ];
    this.idleFrame = { sx: 28, sy: 23, sw: 32, sh: 41 };
    this.crouchFrame = { sx: 2614, sy: 39, sw: 52, sh: 24 };
    this.jumpFrames = [
      { sx: 1904, sy: 18, sw: 20, sh: 22 },
      { sx: 1975, sy: 20, sw: 22, sh: 20 },
      { sx: 2047, sy: 18, sw: 20, sh: 22 },
      { sx: 2121, sy: 20, sw: 22, sh: 20 },
    ];

    // Armamento y estado
    this.weapons =
      typeof WeaponSystem !== "undefined" ? WeaponSystem.getWeapons() : {};
    this.currentWeaponKey = "9mm";
    this.fireCooldown = 0;
    this.score = 0;
    this.gems = 0;
    this.lives = cfg ? cfg.initialLives : 3;
    this.maxHealth = cfg ? cfg.maxHealth : 100;
    this.health = this.maxHealth;
    this.isDead = false;
    this.invulnerableTimer = 0;
    this.bombs = cfg ? cfg.initialBombs : 3;
    this.maxBombs = cfg ? cfg.maxBombs : 5;
    this.bombCooldown = 0;
    this.weaponLevel = 1;
    this.hitFlash = 0;

    // Notificaciones de UI
    this.weaponNotice = "";
    this.weaponNoticeTimer = 0;
    this.animIndex = 0;
    this.animSpeed = 0.18;

    // Sprite
    this.sprite = new Image();
    this.spriteLoaded = false;
    this.sprite.onload = () => {
      this.spriteLoaded = true;
    };
    this.sprite.src = "assets/img/ply1.png";
  }

  setWeapon(weaponKey) {
    if (this.weapons[weaponKey]) {
      if (this.currentWeaponKey === weaponKey && this.weaponLevel < 2) {
        this.weaponLevel = 2;
        this.weaponNotice = `¡${this.weapons[weaponKey].name} MEJORADA!`;
      } else {
        this.currentWeaponKey = weaponKey;
        if (this.weaponLevel < 1) this.weaponLevel = 1;
        this.weaponNotice = `¡${this.weapons[weaponKey].name}!`;
      }
      this.weaponNoticeTimer = 90;
    }
  }

  addBomb(count = 1) {
    this.bombs = Math.min(this.maxBombs, this.bombs + count);
  }

  addHeart() {
    if (this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + 50);
    } else if (this.lives < 5) {
      this.lives++;
    }
  }

  update(keys, mouse, level) {
    if (this.isDead) return;

    if (this.invulnerableTimer > 0) this.invulnerableTimer--;
    if (this.weaponNoticeTimer > 0) this.weaponNoticeTimer--;
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.bombCooldown > 0) this.bombCooldown--;

    // 1. Apuntado con ratón
    const playerCenterX = this.x + this.width / 2;
    const playerCenterY = this.y + this.height / 2;
    const worldMouseX = mouse.x + level.cameraX;
    const worldMouseY = mouse.y + level.cameraY;

    this.aimAngle = Math.atan2(
      worldMouseY - playerCenterY,
      worldMouseX - playerCenterX,
    );
    this.direction = worldMouseX >= playerCenterX ? 1 : -1;

    // 2. Agacharse (cuerpo a tierra)
    const downKey = keys["ArrowDown"] || keys["KeyS"] || false;
    const prevHeight = this.height;
    if (downKey && this.onGround) {
      if (!this.isCrouching) {
        this.isCrouching = true;
        this.height = 24;
        this.y += prevHeight - this.height;
      }
    } else if (this.isCrouching) {
      this.isCrouching = false;
      this.height = 54;
      this.y -= 54 - 24;
    }

    // 3. Movimiento horizontal
    let targetAccel = 0;
    if (keys["ArrowLeft"] || keys["KeyA"]) targetAccel -= this.accel;
    if (keys["ArrowRight"] || keys["KeyD"]) targetAccel += this.accel;
    if (this.isCrouching) targetAccel *= 0.2;

    this.vx += targetAccel;
    this.vx *= this.friction;

    const limitSpeed = this.isCrouching ? this.maxSpeed * 0.3 : this.maxSpeed;
    if (this.vx > limitSpeed) this.vx = limitSpeed;
    if (this.vx < -limitSpeed) this.vx = -limitSpeed;
    if (Math.abs(this.vx) < 0.05) this.vx = 0;

    if (this.onGround && Math.abs(this.vx) > 1.2) {
      this.runDustTimer++;
      if (this.runDustTimer % 6 === 0) {
        level.createExplosion(
          this.x + (this.vx > 0 ? 4 : this.width - 4),
          this.y + this.height - 2,
          "rgba(180, 160, 140, 0.6)",
          2,
        );
      }
    }

    // 4. Salto con Coyote Time y Buffer
    if (this.onGround) this.coyoteTime = 6;
    else if (this.coyoteTime > 0) this.coyoteTime--;

    const jumpRequested =
      keys["Space"] || keys["KeyW"] || keys["ArrowUp"] || keys["KeyX"];
    if (jumpRequested) this.jumpBuffer = 5;
    else if (this.jumpBuffer > 0) this.jumpBuffer--;

    if (this.jumpBuffer > 0 && this.coyoteTime > 0 && !this.isCrouching) {
      this.vy = this.jumpForce;
      this.onGround = false;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
      if (level.sound) level.sound.playJump();
      level.createExplosion(
        this.x + this.width / 2,
        this.y + this.height,
        "#cccccc",
        4,
      );
    }
    if (!jumpRequested && this.vy < -3) this.vy *= 0.65;

    // 5. Gravedad
    this.vy += this.gravity;
    if (this.vy > 10.5) this.vy = 10.5;

    // 6. Límites y posición en X
    this.x += this.vx;
    if (this.x < 10) {
      this.x = 10;
      this.vx = 0;
    }
    if (this.x > level.mapWidth - this.width) {
      this.x = level.mapWidth - this.width;
      this.vx = 0;
    }

    // 7. Movimiento en Y y plataformas
    this.y += this.vy;
    this.onGround = false;

    for (const plat of level.platforms) {
      const prevY = this.y - this.vy;
      if (
        this.x + this.width > plat.x &&
        this.x < plat.x + plat.w &&
        prevY + this.height <= plat.y + 9 &&
        this.y + this.height >= plat.y &&
        this.vy >= 0
      ) {
        this.y = plat.y - this.height;
        this.vy = 0;
        this.onGround = true;
        break;
      }
    }

    // Obstáculos
    for (const obs of level.obstacles) {
      if (
        obs.type === "sandbag" ||
        obs.type === "crate" ||
        obs.type === "barrel"
      ) {
        const prevY = this.y - this.vy;
        if (
          this.x + this.width > obs.x + 2 &&
          this.x < obs.x + obs.w - 2 &&
          prevY + this.height <= obs.y + 8 &&
          this.y + this.height >= obs.y &&
          this.vy >= 0
        ) {
          this.y = obs.y - this.height;
          this.vy = 0;
          this.onGround = true;
        } else if (
          this.x + this.width > obs.x &&
          this.x < obs.x + obs.w &&
          this.y + this.height > obs.y + 4 &&
          this.y < obs.y + obs.h
        ) {
          if (this.vx > 0) this.x = obs.x - this.width;
          else if (this.vx < 0) this.x = obs.x + obs.w;
          this.vx = 0;
        }
      } else if (obs.type === "spikes") {
        if (
          this.x + this.width > obs.x + 4 &&
          this.x < obs.x + obs.w - 4 &&
          this.y + this.height >= obs.y + 8 &&
          this.y < obs.y + obs.h
        ) {
          this.takeDamage(level);
        }
      }
    }

    if (this.y > level.mapHeight + 60) this.takeDamage(level);

    // 8. Animación
    if (this.onGround) {
      this.rollAngle = 0;
      if (Math.abs(this.vx) > 0.1)
        this.animIndex += this.animSpeed * (Math.abs(this.vx) / this.maxSpeed);
      else this.animIndex = 0;
    } else {
      this.rollAngle += this.direction * 0.22;
    }

    // 9. Disparo
    const curW = this.weapons[this.currentWeaponKey];
    if (this.fireCooldown > 0) this.fireCooldown--;
    const shootRequested =
      mouse.isDown || keys["KeyZ"] || keys["KeyJ"] || keys["ControlLeft"];

    if (shootRequested && this.fireCooldown === 0 && curW) {
      if (typeof WeaponSystem !== "undefined") WeaponSystem.fire(this, level);
      const rate =
        this.weaponLevel >= 2
          ? Math.max(3, Math.floor(curW.fireRate * 0.65))
          : curW.fireRate;
      this.fireCooldown = rate;
      this.vx -= Math.cos(this.aimAngle) * 0.35;
    }

    // Bomba de área
    if (keys["KeyB"] && this.bombs > 0 && this.bombCooldown === 0) {
      if (typeof WeaponSystem !== "undefined")
        WeaponSystem.throwBomb(this, level);
    }
  }

  takeDamage(level, amount = 20) {
    if (this.invulnerableTimer > 0 || this.isDead) return;

    this.health -= amount;
    this.invulnerableTimer = 45;
    this.hitFlash = 14;
    level.damageFlash = Math.max(level.damageFlash || 0, 18);
    if (level.sound) level.sound.playDamage();

    level.createExplosion(
      this.x + this.width / 2,
      this.y + this.height / 2,
      "#00e5ff",
      12,
    );
    level.addScreenShake(4);

    if (this.health <= 0) {
      this.lives--;
      this.health = this.maxHealth;

      level.createExplosion(
        this.x + this.width / 2,
        this.y + this.height / 2,
        "#ff0055",
        26,
      );
      level.addScreenShake(12);

      if (this.lives <= 0) {
        this.isDead = true;
        if (level.sound) level.sound.playGameOver();
        level.showEndScreen(false);
      } else {
        this.y = 80;
        this.vy = 0;
        this.x = Math.max(50, level.cameraX + 60);
        this.invulnerableTimer = 120;
      }
    }
  }

  draw(ctx) {
    if (typeof PlayerRenderer !== "undefined") {
      PlayerRenderer.draw(this, ctx);
    }
  }
}
