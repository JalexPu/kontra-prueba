// level-manager.js - Coordinador Central del Juego Kontra

class LevelManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sound = new RetroAudio();

    this.currentLevel = 1;
    this.mapData = typeof MAP_DATA !== "undefined" ? MAP_DATA : null;
    this.mapWidth = this.mapData ? this.mapData.mapWidth : 3500;
    this.mapHeight = canvas.height;

    this.cameraX = 0;
    this.cameraY = 0;
    this.screenShake = 0;

    this.player = new Player(80, 200);
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.platforms = [];
    this.obstacles = [];
    this.emeralds = [];
    this.weaponPickups = [];
    this.bombs = [];
    this.heartItems = [];
    this.bombPickups = [];
    this.turrets = [];
    this.drones = [];
    this.miniBoss = null;
    this.miniBossDefeated = false;
    this.boss = null;
    this.score = 0;
    this.nextExtraLife = 15000;
    this.damageFlash = 0;
    this.checkpointX = 80;
    this.checkpointLevel = 1;
    this.miniBossTriggered = false;

    // Cinemática y Transiciones
    this.isCinematic = false;
    this.cinematicTimer = 0;
    this.cinematicBars = 0;

    // Estados de juego
    this.isIntro = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.isPaused = false;
    this.isTransitioning = false;
    this.isVictoryCinematic = false;
    this.victoryTimer = 0;

    // Callbacks para comunicar con Escenas de Phaser 3
    this.onGameOver = null;
    this.onPauseChange = null;
    this.onLevelTransition = null;

    this.warPlanes = [new WarPlane(canvas.width), new WarPlane(canvas.width)];
    this.warBgImg = new Image();
    this.warBgLoaded = false;
    this.warBgImg.onload = () => {
      this.warBgLoaded = true;
    };
    this.warBgImg.src = "assets/img/fondo_guerra.webp";

    this.mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      isDown: false,
    };
    this.keys = {};

    InputSystem.init(this);
    this.buildLevel(1);

    // Bucle de tiempo fijo (60 Hz)
    this.fixedStep = 1000 / 60;
    this.accumulator = 0;
    this.lastTime = 0;
  }

  getStats() {
    return {
      level: this.currentLevel,
      levelName: this.getLevelName(this.currentLevel),
      score: this.score,
      gems: this.player ? this.player.gems : 0,
      health: this.player ? Math.round(this.player.health) : 0,
      lives: this.player ? this.player.lives : 0,
      weapon:
        this.player &&
        this.player.weapons &&
        this.player.weapons[this.player.currentWeaponKey]
          ? this.player.weapons[this.player.currentWeaponKey].name
          : "9MM PISTOL",
    };
  }

  getLevelName(lvl = this.currentLevel) {
    if (
      typeof MAP_DATA !== "undefined" &&
      MAP_DATA[lvl] &&
      MAP_DATA[lvl].name
    ) {
      return MAP_DATA[lvl].name;
    }
    return `ZONA ${lvl}`;
  }

  destroy() {
    InputSystem.destroy(this);
  }

  togglePause(forceState) {
    if (
      this.isIntro ||
      this.isGameOver ||
      this.isVictory ||
      this.isTransitioning
    )
      return;
    this.isPaused = forceState !== undefined ? forceState : !this.isPaused;
    if (this.sound) this.sound.playPauseSound(!this.isPaused);

    if (this.sound && this.sound.ctx) {
      if (this.isPaused) {
        if (this.sound.ctx.state === "running") this.sound.ctx.suspend();
      } else {
        if (this.sound.ctx.state === "suspended") this.sound.ctx.resume();
      }
    }

    if (this.onPauseChange) {
      this.onPauseChange(this.isPaused, this.getStats());
    }
  }

  buildLevel(levelNum = 1) {
    LevelBuilder.build(this, levelNum);
  }

  startLevelTransition() {
    if (this.isTransitioning) return;
    const nextLevel = Math.min(this.currentLevel + 1, 4);
    CinematicSystem.startTransition(this, nextLevel);

    if (this.onLevelTransition) {
      this.onLevelTransition(nextLevel, this.getLevelName(nextLevel));
    }
  }

  startBossCinematic() {
    CinematicSystem.startBoss(this);
  }

  updateCinematic() {
    CinematicSystem.updateBoss(this);
  }

  startVictoryCinematic() {
    CinematicSystem.startVictory(this);
  }

  onBossDefeated() {
    setTimeout(() => {
      this.startVictoryCinematic();
    }, 1600);
  }

  addBullet(x, y, vx, vy, isEnemy, damage, color, radius) {
    this.bullets.push(new Bullet(x, y, vx, vy, isEnemy, damage, color, radius));
  }

  createExplosion(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  addScreenShake(amount) {
    CameraSystem.addShake(this, amount);
  }

  addBomb(x, y, vx, vy) {
    this.bombs.push(new Bomb(x, y, vx, vy));
  }

  addScore(points) {
    this.score += points;
    while (this.score >= this.nextExtraLife) {
      this.nextExtraLife += 15000;
      if (this.player.lives < 5) {
        this.player.lives++;
        if (this.sound) this.sound.playGemSound();
      }
    }
  }

  showEndScreen(isVictory) {
    this.isGameOver = !isVictory;
    this.isVictory = isVictory;
    if (this.onGameOver) {
      this.onGameOver(isVictory, this.getStats());
    }
  }

  restart(fromCheckpoint = true) {
    this.isGameOver = false;
    this.isVictory = false;
    this.isPaused = false;
    this.isIntro = false;
    this.isVictoryCinematic = false;
    this.victoryTimer = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.screenShake = 0;
    this.bullets = [];
    this.particles = [];
    this.score = 0;
    this.player = new Player(80, 200);
    this.nextExtraLife = 15000;
    this.mapData = typeof MAP_DATA !== "undefined" ? MAP_DATA : this.mapData;

    const lvl =
      fromCheckpoint && this.checkpointLevel >= 1 ? this.checkpointLevel : 1;
    this.buildLevel(lvl);
    if (fromCheckpoint && lvl >= 1 && this.checkpointX > 80) {
      this.player.x = Math.min(this.checkpointX, this.mapWidth - 200);
      this.cameraX = Math.max(0, this.player.x - this.canvas.width * 0.4);
    }
  }

  update() {
    if (this.isVictoryCinematic) {
      CinematicSystem.updateVictory(this);
      return;
    }

    if (this.isTransitioning) {
      CinematicSystem.updateTransition(this);
      return;
    }

    if (
      this.isIntro ||
      this.isGameOver ||
      this.isVictory ||
      this.isPaused
    ) {
      return;
    }

    if (this.isCinematic) {
      this.updateCinematic();
      if (this.boss) this.boss.hoverTime += 0.05;
      for (const p of this.particles) p.update();
      this.particles = this.particles.filter((p) => p.alpha > 0);
      return;
    }

    this.player.update(this.keys, this.mouse, this);

    // Meta alcanzada
    const glacierCleared = this.currentLevel !== 3 || this.miniBossDefeated;
    if (
      this.currentLevel >= 1 &&
      this.currentLevel <= 3 &&
      this.player.x > this.mapWidth - 120 &&
      glacierCleared
    ) {
      this.startLevelTransition();
      return;
    }

    // Cámara
    CameraSystem.update(this);

    if (this.damageFlash > 0) this.damageFlash--;

    // Aviones de fondo
    if (this.currentLevel === 1) {
      for (const plane of this.warPlanes) {
        plane.update(this.canvas.width);
      }
    }

    // Físicas y colisiones
    CollisionSystem.update(this);
  }

  render() {
    LevelRenderer.render(this);
  }

  gameLoop(time) {
    if (!this.lastTime) this.lastTime = time;
    let delta = time - this.lastTime;
    this.lastTime = time;
    if (delta > 250) delta = 250;

    this.accumulator += delta;
    let steps = 0;
    while (this.accumulator >= this.fixedStep && steps < 5) {
      this.update();
      this.accumulator -= this.fixedStep;
      steps++;
    }
    if (steps === 5) this.accumulator = 0;
  }
}
