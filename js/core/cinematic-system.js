// cinematic-system.js - Sistema de Cinemáticas de Transición de Nivel, Entrada de Jefe y Victoria

class CinematicSystem {
  static startTransition(manager, nextLevel) {
    manager.isTransitioning = true;
    manager.transitionTimer = 0;
    manager.transitionTargetLevel = nextLevel;
    manager.transitionBars = 0;
    manager.bullets = [];
    manager.bombs = [];

    if (manager.sound) {
      manager.sound.playLevelClear();
    }
  }

  static updateTransition(manager) {
    manager.transitionTimer++;

    // Despliegue de barras cinemáticas
    if (manager.transitionTimer <= 25) {
      manager.transitionBars = Math.min(60, manager.transitionTimer * 2.4);
    } else if (manager.transitionTimer >= 170) {
      manager.transitionBars = Math.max(0, 60 - (manager.transitionTimer - 170) * 3);
    } else {
      manager.transitionBars = 60;
    }

    // Alarma suave táctica al cargar datos
    if (manager.transitionTimer === 50 && manager.sound) {
      manager.sound.playWeaponPickup();
    }

    // Finalizar transición y cargar nuevo sector
    if (manager.transitionTimer >= 195) {
      manager.isTransitioning = false;
      manager.transitionBars = 0;
      manager.buildLevel(manager.transitionTargetLevel);
    }
  }

  static startBoss(manager) {
    manager.isCinematic = true;
    manager.cinematicTimer = 0;
    manager.cinematicBars = 0;
    manager.cameraX = 80;
    manager.cameraY = 0;
  }

  static updateBoss(manager) {
    manager.cinematicTimer++;

    // Barras cinemáticas
    if (manager.cinematicTimer <= 30) {
      manager.cinematicBars = Math.min(72, manager.cinematicTimer * 2.4);
    } else if (manager.cinematicTimer >= 270) {
      manager.cinematicBars = Math.max(0, 72 - (manager.cinematicTimer - 270) * 2.4);
    } else {
      manager.cinematicBars = 72;
    }

    // Sirenas de alerta
    if (manager.cinematicTimer === 35 || manager.cinematicTimer === 90) {
      if (manager.sound) manager.sound.playBossAlarm();
    }

    // Descenso del Boss con propulsores
    if (
      manager.boss &&
      manager.cinematicTimer >= 100 &&
      manager.cinematicTimer <= 190
    ) {
      manager.boss.y += (160 - manager.boss.y) * 0.08;
      manager.createExplosion(
        manager.boss.x + 22,
        manager.boss.y + manager.boss.height,
        "#ff4400",
        3,
      );
      manager.createExplosion(
        manager.boss.x + manager.boss.width - 22,
        manager.boss.y + manager.boss.height,
        "#ff4400",
        3,
      );

      if (manager.cinematicTimer % 20 === 0 && manager.sound) {
        manager.sound.playBossCharge();
      }
      if (manager.cinematicTimer === 188) {
        manager.addScreenShake(12);
        manager.createExplosion(
          manager.boss.x + manager.boss.width / 2,
          manager.boss.y + manager.boss.height,
          "#cccccc",
          18,
        );
      }
    }

    // Inicio del combate contra el jefe
    if (manager.cinematicTimer >= 300) {
      manager.isCinematic = false;
      manager.cinematicBars = 0;
      if (manager.boss) {
        manager.boss.isActive = true;
        manager.boss.y = 160;
      }
    }
  }

  static startVictory(manager) {
    if (manager.isVictoryCinematic) return;
    manager.isVictoryCinematic = true;
    manager.victoryTimer = 0;
    manager.bullets = [];
    if (manager.sound) manager.sound.playBossDefeat();
  }

  static updateVictory(manager) {
    manager.victoryTimer++;
    if (manager.victoryTimer >= 620) {
      manager.isVictoryCinematic = false;
      manager.showEndScreen(true);
    }
  }
}
