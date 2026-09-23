// collision-system.js - Sistema de Físicas, Detección de Impactos y Recolección de Ítems

class CollisionSystem {
  static update(manager) {
    this.updatePickups(manager);
    this.updateEnemies(manager);
    this.updateBombs(manager);
    this.updateBullets(manager);
    this.updateParticles(manager);
  }

  static updatePickups(manager) {
    const player = manager.player;

    // 1. Esmeraldas
    for (const gem of manager.emeralds) {
      gem.update();
      if (
        player.x + player.width > gem.x &&
        player.x < gem.x + gem.width &&
        player.y + player.height > gem.y &&
        player.y < gem.y + gem.height
      ) {
        gem.toRemove = true;
        player.gems++;
        manager.score += 100;
        if (manager.sound) manager.sound.playGemSound();
        manager.createExplosion(
          gem.x + gem.width / 2,
          gem.y + gem.height / 2,
          "#00f5d4",
          8,
        );
      }
    }
    manager.emeralds = manager.emeralds.filter((g) => !g.toRemove);

    // 2. Armas
    for (const wp of manager.weaponPickups) {
      wp.update();
      if (
        player.x + player.width > wp.x &&
        player.x < wp.x + wp.width &&
        player.y + player.height > wp.y &&
        player.y < wp.y + wp.height
      ) {
        wp.toRemove = true;
        player.setWeapon(wp.weaponKey);
        if (manager.sound) manager.sound.playWeaponPickup();
        manager.createExplosion(
          wp.x + wp.width / 2,
          wp.y + wp.height / 2,
          "#ffea00",
          12,
        );
      }
    }
    manager.weaponPickups = manager.weaponPickups.filter((w) => !w.toRemove);

    // 3. Botiquines de Corazón
    for (const heart of manager.heartItems) {
      heart.update();
      if (
        player.x + player.width > heart.x &&
        player.x < heart.x + heart.width &&
        player.y + player.height > heart.y &&
        player.y < heart.y + heart.height
      ) {
        heart.toRemove = true;
        player.addHeart();
        if (manager.sound) manager.sound.playWeaponPickup();
        manager.createExplosion(
          heart.x + heart.width / 2,
          heart.y + heart.height / 2,
          "#ff0055",
          14,
        );
      }
    }
    manager.heartItems = manager.heartItems.filter((h) => !h.toRemove);

    // 4. Munición de Bombas
    for (const bp of manager.bombPickups) {
      bp.update();
      if (
        player.x + player.width > bp.x &&
        player.x < bp.x + bp.width &&
        player.y + player.height > bp.y &&
        player.y < bp.y + bp.height
      ) {
        bp.toRemove = true;
        player.addBomb(1);
        if (manager.sound) manager.sound.playWeaponPickup();
        manager.createExplosion(
          bp.x + bp.width / 2,
          bp.y + bp.height / 2,
          "#ffea00",
          12,
        );
      }
    }
    manager.bombPickups = manager.bombPickups.filter((b) => !b.toRemove);
  }

  static updateEnemies(manager) {
    const player = manager.player;

    // Enemigos comunes terrestres
    for (const enemy of manager.enemies) {
      enemy.update(player, manager);
    }
    manager.enemies = manager.enemies.filter((e) => !e.toRemove);

    // Torretas fijas
    for (const turret of manager.turrets) {
      turret.update(player, manager);
    }
    manager.turrets = manager.turrets.filter((t) => !t.toRemove);

    // Drones voladores
    for (const drone of manager.drones) {
      drone.update(player, manager);
    }
    manager.drones = manager.drones.filter((d) => !d.toRemove);

    // Mini-jefe del Glaciar
    if (manager.miniBoss) {
      if (!manager.miniBossTriggered && player.x > manager.miniBoss.x - 560) {
        manager.miniBossTriggered = true;
      }
      if (manager.miniBossTriggered) {
        manager.miniBoss.update(player, manager);
      }
      if (manager.miniBoss.toRemove) manager.miniBoss = null;
    }

    // Jefe Final Robot (Omega Prime)
    if (manager.boss) {
      manager.boss.update(player, manager);
    }
  }

  static updateBombs(manager) {
    for (const bomb of manager.bombs) {
      bomb.update(manager);
    }
    manager.bombs = manager.bombs.filter((b) => !b.toRemove);
  }

  static updateBullets(manager) {
    const player = manager.player;

    for (const b of manager.bullets) {
      b.update();

      // Colisión de bala con obstáculos sólidos del mapa
      for (const obs of manager.obstacles) {
        if (obs.type === "spikes") continue;
        const hitObstacle =
          b.x > obs.x &&
          b.x < obs.x + obs.w &&
          b.y > obs.y &&
          b.y < obs.y + obs.h;
        if (hitObstacle) {
          b.toRemove = true;
          break;
        }
      }

      if (b.toRemove) continue;

      if (!b.isEnemy) {
        // Balas del jugador -> Impacto en enemigos comunes
        for (const enemy of manager.enemies) {
          if (
            b.x > enemy.x &&
            b.x < enemy.x + enemy.width &&
            b.y > enemy.y &&
            b.y < enemy.y + enemy.height
          ) {
            enemy.hit(b.damage, manager);
            b.toRemove = true;
            break;
          }
        }

        // Impacto en torretas
        if (!b.toRemove) {
          for (const turret of manager.turrets) {
            if (
              b.x > turret.x &&
              b.x < turret.x + turret.width &&
              b.y > turret.y &&
              b.y < turret.y + turret.height
            ) {
              turret.hit(b.damage, manager);
              b.toRemove = true;
              break;
            }
          }
        }

        // Impacto en drones
        if (!b.toRemove) {
          for (const drone of manager.drones) {
            if (
              b.x > drone.x &&
              b.x < drone.x + drone.width &&
              b.y > drone.y &&
              b.y < drone.y + drone.height
            ) {
              drone.hit(b.damage, manager);
              b.toRemove = true;
              break;
            }
          }
        }

        // Impacto en mini-jefe
        if (
          !b.toRemove &&
          manager.miniBoss &&
          manager.miniBossTriggered &&
          b.x > manager.miniBoss.x &&
          b.x < manager.miniBoss.x + manager.miniBoss.width &&
          b.y > manager.miniBoss.y &&
          b.y < manager.miniBoss.y + manager.miniBoss.height
        ) {
          manager.miniBoss.hit(b.damage, manager);
          b.toRemove = true;
        }

        // Impacto en Robot Jefe Final
        if (
          !b.toRemove &&
          manager.boss &&
          manager.boss.isActive &&
          !manager.boss.isDying
        ) {
          if (
            b.x > manager.boss.x &&
            b.x < manager.boss.x + manager.boss.width &&
            b.y > manager.boss.y &&
            b.y < manager.boss.y + manager.boss.height
          ) {
            manager.boss.hit(b.damage, manager);
            b.toRemove = true;
          }
        }
      } else {
        // Balas enemigas -> Impacto en el jugador
        if (
          !player.isDead &&
          player.invulnerableTimer === 0 &&
          b.x > player.x &&
          b.x < player.x + player.width &&
          b.y > player.y &&
          b.y < player.y + player.height
        ) {
          player.takeDamage(manager);
          b.toRemove = true;
        }
      }

      // Descartar balas fuera de la cámara
      if (
        b.x < manager.cameraX - 50 ||
        b.x > manager.cameraX + manager.canvas.width + 50
      ) {
        b.toRemove = true;
      }
    }
    manager.bullets = manager.bullets.filter((b) => !b.toRemove);
  }

  static updateParticles(manager) {
    for (const p of manager.particles) {
      p.update();
    }
    manager.particles = manager.particles.filter((p) => p.alpha > 0);
  }
}
