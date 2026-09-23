// weapon-system.js - Configuración y Lógica de Disparo de Armas del Jugador

const WEAPONS_CONFIG = {
  "9mm": {
    name: "9MM PISTOL",
    fireRate: 10,
    speed: 8.5,
    spreadCount: 1,
    damage: 1,
    color: "#ffea00",
    burst: false,
  },
  shotgun: {
    name: "ESCOPETA SPREAD",
    fireRate: 20,
    speed: 8.0,
    spreadCount: 5,
    spreadAngle: 0.32,
    damage: 1,
    color: "#ff9900",
    burst: false,
  },
  rifle: {
    name: "RIFLE DE ASALTO",
    fireRate: 8,
    speed: 11.0,
    spreadCount: 1,
    damage: 2,
    color: "#00f5d4",
    burst: false,
  },
  submachine: {
    name: "SUBFUSIL RÁPIDO",
    fireRate: 4,
    speed: 9.2,
    spreadCount: 1,
    spreadAngle: 0.08,
    damage: 1,
    color: "#ff0055",
    burst: true,
  },
};

class WeaponSystem {
  static getWeapons() {
    return JSON.parse(JSON.stringify(WEAPONS_CONFIG));
  }

  static fire(player, level) {
    const weapon =
      player.weapons[player.currentWeaponKey] || WEAPONS_CONFIG["9mm"];
    const spawnX = player.x + player.width / 2 + Math.cos(player.aimAngle) * 26;
    const spawnY =
      player.y +
      (player.isCrouching ? 16 : 20) +
      Math.sin(player.aimAngle) * 26;

    if (weapon.spreadCount > 1) {
      const count = weapon.spreadCount;
      const halfSpread = weapon.spreadAngle / 2;
      const step = weapon.spreadAngle / (count - 1);

      for (let i = 0; i < count; i++) {
        const angle = player.aimAngle - halfSpread + i * step;
        const bvx = Math.cos(angle) * weapon.speed;
        const bvy = Math.sin(angle) * weapon.speed;
        level.addBullet(
          spawnX,
          spawnY,
          bvx,
          bvy,
          false,
          weapon.damage,
          weapon.color,
          5.5,
        );
      }
    } else if (weapon.burst && weapon.spreadAngle) {
      const angle =
        player.aimAngle + (Math.random() - 0.5) * weapon.spreadAngle;
      const bvx = Math.cos(angle) * weapon.speed;
      const bvy = Math.sin(angle) * weapon.speed;
      level.addBullet(
        spawnX,
        spawnY,
        bvx,
        bvy,
        false,
        weapon.damage,
        weapon.color,
        4.5,
      );
    } else {
      const bvx = Math.cos(player.aimAngle) * weapon.speed;
      const bvy = Math.sin(player.aimAngle) * weapon.speed;
      const bulletSize = weapon.damage > 1 ? 6.5 : 5.0;
      level.addBullet(
        spawnX,
        spawnY,
        bvx,
        bvy,
        false,
        weapon.damage,
        weapon.color,
        bulletSize,
      );
    }

    // Potencia nivel 2: proyectil adicional en paralelo
    if (player.weaponLevel >= 2 && weapon.spreadCount === 1) {
      const extra = player.aimAngle + 0.08;
      level.addBullet(
        spawnX,
        spawnY,
        Math.cos(extra) * weapon.speed,
        Math.sin(extra) * weapon.speed,
        false,
        weapon.damage,
        weapon.color,
        4.5,
      );
    }

    if (level.sound) level.sound.playPlayerShoot(player.currentWeaponKey);
  }

  static throwBomb(player, level) {
    const bx = player.x + player.width / 2 + Math.cos(player.aimAngle) * 18;
    const by = player.y + 18 + Math.sin(player.aimAngle) * 18;
    const bvx = Math.cos(player.aimAngle) * 6.5;
    const bvy = Math.sin(player.aimAngle) * 6.5 - 1.5;
    level.addBomb(bx, by, bvx, bvy);
    player.bombs--;
    player.bombCooldown = 40;
    if (level.sound) level.sound.playBossCharge();
    level.addScreenShake(4);
  }
}
