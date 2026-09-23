// mapa.js - Archivo Único Centralizado para Todos los Mapas y la Construcción de Niveles

const MAP_DATA = {
  1: {
    name: "ZONA 1 - RUINAS EXTERIORES",
    mapWidth: 3500,
    mapHeight: 460,
    spawn: { x: 80, y: 200 },
    platforms: [
      { x: 0, y: 390, w: 920, h: 70 },
      { x: 1000, y: 390, w: 1100, h: 70 },
      { x: 2180, y: 390, w: 1320, h: 70 },
      { x: 220, y: 310, w: 180, h: 16 },
      { x: 350, y: 220, w: 180, h: 16 },
      { x: 620, y: 290, w: 200, h: 16 },
      { x: 760, y: 190, w: 170, h: 16 },
      { x: 1060, y: 290, w: 220, h: 16 },
      { x: 1210, y: 190, w: 180, h: 16 },
      { x: 1440, y: 280, w: 200, h: 16 },
      { x: 1620, y: 180, w: 220, h: 16 },
      { x: 1820, y: 270, w: 180, h: 16 },
      { x: 2260, y: 280, w: 200, h: 16 },
      { x: 2420, y: 190, w: 180, h: 16 },
      { x: 2680, y: 270, w: 220, h: 16 },
      { x: 2850, y: 180, w: 260, h: 16 },
      { x: 3050, y: 260, w: 220, h: 16 },
    ],
    obstacles: [
      { x: 560, y: 356, w: 46, h: 34, type: "sandbag" },
      { x: 860, y: 354, w: 36, h: 36, type: "barrel" },
      { x: 1320, y: 366, w: 50, h: 24, type: "spikes" },
      { x: 1580, y: 354, w: 36, h: 36, type: "crate" },
      { x: 1970, y: 354, w: 36, h: 36, type: "barrel" },
      { x: 2520, y: 356, w: 46, h: 34, type: "sandbag" },
      { x: 2780, y: 366, w: 50, h: 24, type: "spikes" },
      { x: 3020, y: 354, w: 36, h: 36, type: "crate" },
    ],
    weapons: [
      { x: 400, y: 180, type: "shotgun" },
      { x: 1260, y: 150, type: "submachine" },
      { x: 2480, y: 150, type: "rifle" },
    ],
    emeralds: [
      { x: 250, y: 270 },
      { x: 380, y: 180 },
      { x: 480, y: 350 },
      { x: 650, y: 250 },
      { x: 800, y: 150 },
      { x: 1100, y: 250 },
      { x: 1350, y: 350 },
      { x: 1480, y: 240 },
      { x: 1660, y: 140 },
      { x: 1860, y: 230 },
      { x: 2300, y: 240 },
      { x: 2550, y: 350 },
      { x: 2720, y: 230 },
      { x: 2950, y: 140 },
      { x: 3100, y: 350 },
      { x: 3250, y: 220 },
    ],
    enemies: [
      { x: 460, y: 330, type: "soldier" },
      { x: 740, y: 330, type: "soldier" },
      { x: 1160, y: 330, type: "soldier" },
      { x: 1520, y: 330, type: "soldier" },
      { x: 1780, y: 330, type: "soldier" },
      { x: 2320, y: 330, type: "soldier" },
      { x: 2620, y: 330, type: "soldier" },
      { x: 2880, y: 330, type: "soldier" },
      { x: 390, y: 170, type: "sniper" },
      { x: 810, y: 140, type: "sniper" },
      { x: 1270, y: 140, type: "sniper" },
      { x: 1670, y: 130, type: "sniper" },
      { x: 2470, y: 140, type: "sniper" },
      { x: 2920, y: 130, type: "sniper" },
      { x: 3150, y: 210, type: "sniper" },
    ],
    turrets: [],
    drones: [],
    bombs: [],
    hearts: [],
  },

  2: {
    name: "ZONA 2 - PERÍMETRO INDUSTRIAL",
    mapWidth: 3200,
    mapHeight: 460,
    spawn: { x: 80, y: 200 },
    platforms: [
      { x: 0, y: 390, w: 540, h: 70 },
      { x: 620, y: 390, w: 360, h: 70 },
      { x: 1060, y: 390, w: 320, h: 70 },
      { x: 1460, y: 390, w: 460, h: 70 },
      { x: 2000, y: 390, w: 320, h: 70 },
      { x: 2400, y: 390, w: 800, h: 70 },
      { x: 300, y: 280, w: 150, h: 16 },
      { x: 700, y: 250, w: 150, h: 16 },
      { x: 1120, y: 290, w: 130, h: 16 },
      { x: 1520, y: 250, w: 150, h: 16 },
      { x: 1880, y: 290, w: 130, h: 16 },
      { x: 2260, y: 240, w: 150, h: 16 },
      { x: 2620, y: 280, w: 160, h: 16 },
    ],
    obstacles: [
      { x: 250, y: 356, w: 48, h: 34, type: "sandbag" },
      { x: 470, y: 356, w: 40, h: 34, type: "barrel" },
      { x: 680, y: 356, w: 44, h: 34, type: "crate" },
      { x: 900, y: 380, w: 60, h: 10, type: "spikes" },
      { x: 1200, y: 356, w: 48, h: 34, type: "sandbag" },
      { x: 1380, y: 380, w: 70, h: 10, type: "spikes" },
      { x: 1600, y: 356, w: 40, h: 34, type: "barrel" },
      { x: 2100, y: 356, w: 48, h: 34, type: "sandbag" },
      { x: 2500, y: 356, w: 44, h: 34, type: "crate" },
      { x: 2900, y: 356, w: 40, h: 34, type: "barrel" },
    ],
    weapons: [
      { x: 340, y: 248, type: "shotgun" },
      { x: 1560, y: 218, type: "rifle" },
      { x: 2660, y: 248, type: "submachine" },
    ],
    emeralds: [
      { x: 150, y: 330 },
      { x: 760, y: 206 },
      { x: 1180, y: 250 },
      { x: 1560, y: 206 },
      { x: 2320, y: 196 },
      { x: 2700, y: 236 },
      { x: 3050, y: 330 },
    ],
    enemies: [
      { x: 500, y: 336, type: "soldier" },
      { x: 780, y: 336, type: "sniper" },
      { x: 940, y: 336, type: "soldier" },
      { x: 1250, y: 336, type: "soldier" },
      { x: 1550, y: 336, type: "sniper" },
      { x: 1760, y: 336, type: "soldier" },
      { x: 2080, y: 336, type: "soldier" },
      { x: 2440, y: 336, type: "sniper" },
      { x: 2560, y: 336, type: "soldier" },
      { x: 2850, y: 336, type: "soldier" },
    ],
    turrets: [],
    drones: [],
    bombs: [
      { x: 1150, y: 250 },
      { x: 2620, y: 250 },
    ],
    hearts: [{ x: 1900, y: 250 }],
  },

  3: {
    name: "ZONA 3 - GLACIAR OMEGA",
    mapWidth: 3400,
    mapHeight: 460,
    spawn: { x: 80, y: 200 },
    platforms: [
      { x: 0, y: 390, w: 600, h: 70 },
      { x: 680, y: 390, w: 400, h: 70 },
      { x: 1160, y: 390, w: 300, h: 70 },
      { x: 1560, y: 390, w: 520, h: 70 },
      { x: 2200, y: 390, w: 380, h: 70 },
      { x: 2660, y: 390, w: 740, h: 70 },
      { x: 260, y: 290, w: 160, h: 16 },
      { x: 760, y: 250, w: 160, h: 16 },
      { x: 1220, y: 280, w: 140, h: 16 },
      { x: 1640, y: 240, w: 170, h: 16 },
      { x: 2100, y: 290, w: 140, h: 16 },
      { x: 2480, y: 240, w: 170, h: 16 },
      { x: 2880, y: 280, w: 160, h: 16 },
    ],
    obstacles: [
      { x: 300, y: 356, w: 44, h: 34, type: "crate" },
      { x: 720, y: 380, w: 70, h: 10, type: "spikes" },
      { x: 1200, y: 356, w: 40, h: 34, type: "barrel" },
      { x: 1700, y: 356, w: 48, h: 34, type: "sandbag" },
      { x: 2260, y: 380, w: 60, h: 10, type: "spikes" },
      { x: 2700, y: 356, w: 44, h: 34, type: "crate" },
    ],
    weapons: [
      { x: 300, y: 258, type: "submachine" },
      { x: 1680, y: 208, type: "shotgun" },
    ],
    emeralds: [
      { x: 180, y: 330 },
      { x: 820, y: 206 },
      { x: 1300, y: 240 },
      { x: 1700, y: 196 },
      { x: 2540, y: 196 },
      { x: 2960, y: 236 },
      { x: 3200, y: 330 },
    ],
    enemies: [
      { x: 620, y: 336, type: "soldier" },
      { x: 1600, y: 336, type: "sniper" },
      { x: 2900, y: 336, type: "soldier" },
    ],
    turrets: [
      { x: 500, y: 350 },
      { x: 1250, y: 350 },
      { x: 2350, y: 350 },
      { x: 3050, y: 350 },
    ],
    drones: [
      { x: 900, y: 180 },
      { x: 1900, y: 160 },
      { x: 2800, y: 180 },
    ],
    bombs: [
      { x: 780, y: 250 },
      { x: 2480, y: 250 },
    ],
    hearts: [{ x: 2700, y: 250 }],
    miniBoss: { x: 3200, y: 300 },
  },

  4: {
    name: "ZONA 4 - BÚNKER OMEGA PRIME",
    mapWidth: 1000,
    mapHeight: 460,
    spawn: { x: 110, y: 336 },
    platforms: [
      { x: 0, y: 390, w: 1000, h: 70 },
      { x: 70, y: 300, w: 180, h: 16 },
      { x: 130, y: 190, w: 160, h: 16 },
      { x: 380, y: 240, w: 240, h: 16 },
      { x: 680, y: 300, w: 180, h: 16 },
      { x: 640, y: 180, w: 170, h: 16 },
    ],
    obstacles: [
      { x: 100, y: 356, w: 46, h: 34, type: "sandbag" },
      { x: 810, y: 354, w: 36, h: 36, type: "crate" },
    ],
    weapons: [
      { x: 470, y: 190, type: "rifle" },
      { x: 140, y: 250, type: "shotgun" },
    ],
    emeralds: [
      { x: 200, y: 140 },
      { x: 500, y: 350 },
      { x: 730, y: 130 },
    ],
    enemies: [],
    turrets: [],
    drones: [],
    bombs: [],
    hearts: [],
    boss: { x: 550, y: -120 },
  },
};

class LevelBuilder {
  static build(manager, levelNum = 1) {
    manager.currentLevel = levelNum;
    manager.platforms = [];
    manager.obstacles = [];
    manager.enemies = [];
    manager.emeralds = [];
    manager.weaponPickups = [];
    manager.bullets = [];
    manager.bombs = [];
    manager.heartItems = [];
    manager.bombPickups = [];
    manager.turrets = [];
    manager.drones = [];
    manager.miniBoss = null;
    manager.miniBossDefeated = false;
    manager.miniBossTriggered = false;
    manager.boss = null;
    manager.isCinematic = false;
    manager.cinematicBars = 0;
    manager.isTransitioning = false;
    manager.player.health = manager.player.maxHealth;

    const data = MAP_DATA[levelNum];
    if (!data) return;

    manager.mapWidth = data.mapWidth || 3500;
    manager.player.x = data.spawn ? data.spawn.x : 80;
    manager.player.y = data.spawn ? data.spawn.y : 200;
    manager.player.vx = 0;
    manager.player.vy = 0;

    // 1. Plataformas y Obstáculos
    if (data.platforms) {
      data.platforms.forEach((p) =>
        manager.platforms.push({ x: p.x, y: p.y, w: p.w, h: p.h }),
      );
    }
    if (data.obstacles) {
      data.obstacles.forEach((o) =>
        manager.obstacles.push({
          x: o.x,
          y: o.y,
          w: o.w,
          h: o.h,
          type: o.type,
        }),
      );
    }

    // 2. Ítems y Coleccionables
    if (data.weapons) {
      data.weapons.forEach((w) =>
        manager.weaponPickups.push(new WeaponPickup(w.x, w.y, w.type)),
      );
    }
    if (data.emeralds) {
      data.emeralds.forEach((g) =>
        manager.emeralds.push(new Emerald(g.x, g.y)),
      );
    }
    if (data.bombs) {
      data.bombs.forEach((b) =>
        manager.bombPickups.push(new BombPickup(b.x, b.y)),
      );
    }
    if (data.hearts) {
      data.hearts.forEach((h) =>
        manager.heartItems.push(new HeartItem(h.x, h.y)),
      );
    }

    // 3. Enemigos, Torretas y Drones
    if (data.enemies) {
      data.enemies.forEach((e) =>
        manager.enemies.push(new Enemy(e.x, e.y, e.type)),
      );
    }
    if (data.turrets) {
      data.turrets.forEach((t) => manager.turrets.push(new Turret(t.x, t.y)));
    }
    if (data.drones) {
      data.drones.forEach((d) => manager.drones.push(new Drone(d.x, d.y)));
    }

    // 4. Jefes
    if (data.miniBoss) {
      manager.miniBoss = new MiniBoss(data.miniBoss.x, data.miniBoss.y);
      manager.miniBossTriggered = false;
    }
    if (data.boss) {
      manager.boss = new BossRobot(data.boss.x, data.boss.y);
      manager.startBossCinematic();
    }
  }
}
