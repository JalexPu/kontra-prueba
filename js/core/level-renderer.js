// level-renderer.js - Motor Gráfico 2D, Fondos Parallax, Plataformas, HUD Arcade y Cinemáticas

class LevelRenderer {
  static render(manager) {
    const ctx = manager.ctx;
    const canvas = manager.canvas;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Fondos con Parallax
    this.drawBackground(manager);

    // 2. Desplazamiento del mundo (Cámara y Vibración)
    ctx.save();
    let shakeX = 0;
    let shakeY = 0;
    if (manager.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * manager.screenShake;
      shakeY = (Math.random() - 0.5) * manager.screenShake;
    }
    ctx.translate(
      Math.floor(-manager.cameraX + shakeX),
      Math.floor(-manager.cameraY + shakeY),
    );

    // Plataformas y Obstáculos
    this.drawPlatforms(manager);
    this.drawObstacles(manager);

    // Entidades e Ítems
    for (const gem of manager.emeralds) gem.draw(ctx);
    for (const wp of manager.weaponPickups) wp.draw(ctx);
    for (const turret of manager.turrets) turret.draw(ctx);
    for (const enemy of manager.enemies) enemy.draw(ctx);
    for (const drone of manager.drones) drone.draw(ctx);
    if (manager.miniBoss) manager.miniBoss.draw(ctx);
    if (manager.boss) manager.boss.draw(ctx);
    for (const heart of manager.heartItems) heart.draw(ctx);
    for (const bp of manager.bombPickups) bp.draw(ctx);
    for (const bomb of manager.bombs) bomb.draw(ctx);
    for (const b of manager.bullets) b.draw(ctx);
    for (const p of manager.particles) p.draw(ctx);

    // Soldado Jugador
    manager.player.draw(ctx);

    ctx.restore();

    // 3. Efectos de pantalla completa
    if (manager.damageFlash > 0) {
      ctx.fillStyle = `rgba(255, 0, 50, ${manager.damageFlash * 0.08})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 4. Barras de Cinemática
    if (manager.cinematicBars > 0) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, manager.cinematicBars);
      ctx.fillRect(
        0,
        canvas.height - manager.cinematicBars,
        canvas.width,
        manager.cinematicBars,
      );

      if (manager.cinematicTimer >= 35 && manager.cinematicTimer <= 135) {
        const pulse = Math.floor(manager.cinematicTimer / 10) % 2 === 0;
        ctx.fillStyle = pulse ? "#ff0033" : "#ffcc00";
        ctx.font = '900 22px "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.fillText(
          "¡ADVERTENCIA // DETECTADO OMEGA PRIME!",
          canvas.width / 2,
          48,
        );
      }
    }

    // 5. Interfaz HUD Arcade
    this.drawHUD(manager);

    // 6. Cinemática de Transición de Nivel
    if (manager.isTransitioning) {
      this.drawLevelTransition(manager);
    }

    // 7. Cinemática de Victoria Final
    if (manager.isVictoryCinematic) {
      this.drawVictoryCinematic(manager);
    }

    ctx.restore();
  }

  static drawBackground(manager) {
    const ctx = manager.ctx;
    const w = manager.canvas.width;
    const h = manager.canvas.height;

    if (manager.currentLevel === 1) {
      // Zona 1: Ruinas Exteriores
      if (manager.warBgLoaded) {
        const bgW = manager.warBgImg.width || 800;
        const bgH = manager.warBgImg.height || 460;
        const bgOffsetX = (manager.cameraX * 0.15) % bgW;
        for (let x = -bgOffsetX - bgW; x < w + bgW; x += bgW) {
          ctx.drawImage(manager.warBgImg, x, 0, bgW, bgH);
        }
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#1c0d12");
        grad.addColorStop(0.5, "#3d181a");
        grad.addColorStop(1, "#12080a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      for (const plane of manager.warPlanes) {
        plane.draw(ctx);
      }

      // Siluetas de ruinas con parallax
      ctx.fillStyle = "#121822";
      const m1Offset = (manager.cameraX * 0.35) % 180;
      for (let x = -m1Offset; x <= w + 400; x += 180) {
        ctx.fillRect(x, 260, 140, 200);
      }
    } else if (manager.currentLevel === 2) {
      this.drawIndustrialBackground(manager);
    } else if (manager.currentLevel === 3) {
      this.drawGlacierBackground(manager);
    } else {
      this.drawLevel4Background(manager);
    }
  }

  static drawIndustrialBackground(manager) {
    const ctx = manager.ctx;
    const w = manager.canvas.width;
    const h = manager.canvas.height;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, "#080d18");
    skyGrad.addColorStop(0.45, "#182030");
    skyGrad.addColorStop(1, "#281b18");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Fábricas lejanas
    ctx.fillStyle = "#121824";
    const skyOffset = (manager.cameraX * 0.18) % 300;
    for (let x = -skyOffset - 300; x < w + 300; x += 300) {
      ctx.fillRect(x + 20, 230, 80, 230);
      ctx.fillRect(x + 130, 200, 120, 260);
      ctx.fillRect(x + 50, 150, 14, 80);
    }

    // Estructuras industriales cercanas
    ctx.fillStyle = "#1b2333";
    const nearOffset = (manager.cameraX * 0.45) % 420;
    for (let x = -nearOffset - 420; x < w + 420; x += 420) {
      ctx.fillRect(x, 280, 200, 180);
      ctx.fillRect(x + 240, 240, 160, 220);
    }
  }

  static drawGlacierBackground(manager) {
    const ctx = manager.ctx;
    const w = manager.canvas.width;
    const h = manager.canvas.height;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, "#040b17");
    skyGrad.addColorStop(0.5, "#0b2038");
    skyGrad.addColorStop(1, "#183b54");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Montañas de hielo
    ctx.fillStyle = "#0c2842";
    const farOffset = (manager.cameraX * 0.2) % 250;
    for (let x = -farOffset - 500; x < w + 500; x += 250) {
      ctx.beginPath();
      ctx.moveTo(x, 460);
      ctx.lineTo(x + 125, 200);
      ctx.lineTo(x + 250, 460);
      ctx.closePath();
      ctx.fill();
    }
  }

  static drawLevel4Background(manager) {
    const ctx = manager.ctx;
    const w = manager.canvas.width;
    const h = manager.canvas.height;

    const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
    wallGrad.addColorStop(0, "#080a10");
    wallGrad.addColorStop(0.5, "#121824");
    wallGrad.addColorStop(1, "#180a0e");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h);

    // Núcleo central brillante
    const coreX = w / 2;
    const coreY = 190;
    const isBerserk = manager.boss && manager.boss.isBerserk;
    const glow = ctx.createRadialGradient(coreX, coreY, 20, coreX, coreY, 260);
    glow.addColorStop(
      0,
      isBerserk ? "rgba(255, 0, 50, 0.45)" : "rgba(0, 245, 212, 0.35)",
    );
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 260, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawPlatforms(manager) {
    const ctx = manager.ctx;
    for (const plat of manager.platforms) {
      if (
        plat.x + plat.w < manager.cameraX - 40 ||
        plat.x > manager.cameraX + manager.canvas.width + 40
      )
        continue;

      // Base metálica
      ctx.fillStyle = manager.currentLevel === 3 ? "#1b3a54" : "#1a2230";
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

      // Borde superior brillante
      ctx.fillStyle = manager.currentLevel === 3 ? "#7dd3fc" : "#00f5d4";
      ctx.fillRect(plat.x, plat.y, plat.w, 3);
      ctx.fillStyle = manager.currentLevel === 3 ? "#0284c7" : "#028070";
      ctx.fillRect(plat.x, plat.y + 3, plat.w, 3);
    }
  }

  static drawObstacles(manager) {
    const ctx = manager.ctx;
    for (const obs of manager.obstacles) {
      if (
        obs.x + obs.w < manager.cameraX - 40 ||
        obs.x > manager.cameraX + manager.canvas.width + 40
      )
        continue;

      if (obs.type === "sandbag") {
        ctx.fillStyle = "#8a7356";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = "#574836";
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
      } else if (obs.type === "barrel") {
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(obs.x, obs.y + 12, obs.w, 8);
      } else if (obs.type === "crate") {
        ctx.fillStyle = "#78350f";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = "#451a03";
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
      } else if (obs.type === "spikes") {
        ctx.fillStyle = "#ef4444";
        for (let px = 0; px < obs.w; px += 10) {
          ctx.beginPath();
          ctx.moveTo(obs.x + px, obs.y + obs.h);
          ctx.lineTo(obs.x + px + 5, obs.y);
          ctx.lineTo(obs.x + px + 10, obs.y + obs.h);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  static drawHUD(manager) {
    const ctx = manager.ctx;
    const player = manager.player;

    // Barra superior estilo arcade
    ctx.save();
    ctx.fillStyle = "rgba(11, 19, 31, 0.88)";
    ctx.fillRect(0, 0, 840, 36);
    ctx.fillStyle = "#00f5d4";
    ctx.fillRect(0, 35, 840, 2);

    // 1. PUNTUACIÓN
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillStyle = "#8fa0b8";
    ctx.fillText("1P SCORE", 16, 15);
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillStyle = "#ffea00";
    ctx.fillText(manager.score.toString().padStart(6, "0"), 16, 30);

    // 2. ESMERALDAS
    ctx.fillStyle = "#00f5d4";
    ctx.fillText(`💎 ${player.gems}`, 135, 24);

    // 3. SALUD Y VIDAS
    ctx.fillStyle = "#8fa0b8";
    ctx.fillText("VIDA:", 230, 24);
    const hpRatio = Math.max(0, player.health / player.maxHealth);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(275, 12, 100, 14);
    ctx.fillStyle =
      hpRatio > 0.5 ? "#00f5d4" : hpRatio > 0.25 ? "#ffaa00" : "#ff0033";
    ctx.fillRect(277, 14, 96 * hpRatio, 10);

    // Vidas (Corazones)
    let heartX = 390;
    for (let i = 0; i < player.lives; i++) {
      ctx.fillStyle = "#ff0055";
      ctx.fillText("♥", heartX, 24);
      heartX += 16;
    }

    // 4. ARMA Y BOMBAS
    ctx.fillStyle = "#ffaa00";
    const weaponName = player.weapons[player.currentWeaponKey]
      ? player.weapons[player.currentWeaponKey].name
      : "9MM";
    ctx.fillText(`ARMA: ${weaponName}`, 470, 24);

    ctx.fillStyle = "#00f5d4";
    ctx.fillText(`💣 ${player.bombs}`, 670, 24);

    // 5. Barra de Jefe (si está activo)
    if (manager.boss && manager.boss.isActive && !manager.boss.isDying) {
      const bRatio = Math.max(0, manager.boss.health / manager.boss.maxHealth);
      ctx.fillStyle = "rgba(10, 15, 26, 0.9)";
      ctx.fillRect(220, 48, 400, 16);
      ctx.fillStyle = manager.boss.isBerserk ? "#ff0033" : "#00f5d4";
      ctx.fillRect(222, 50, 396 * bRatio, 12);
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 10px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.fillText("OMEGA PRIME // NÚCLEO AUTÓMATA", 420, 60);
    }

    ctx.restore();
  }

  static drawLevelTransition(manager) {
    const ctx = manager.ctx;
    const w = manager.canvas.width;
    const h = manager.canvas.height;
    const t = manager.transitionTimer || 0;
    const nextLvl = manager.transitionTargetLevel || Math.min(manager.currentLevel + 1, 4);
    const nextName = manager.getLevelName(nextLvl);

    ctx.save();
    // 1. Fondo semitransparente táctico
    const alpha = Math.min(0.92, t * 0.05);
    ctx.fillStyle = `rgba(6, 12, 22, ${alpha})`;
    ctx.fillRect(0, 0, w, h);

    // 2. Barras cinemáticas superior e inferior
    const barH = manager.transitionBars || 50;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, barH);
    ctx.fillRect(0, h - barH, w, barH);

    // 3. Panel central tipo dossier militar con bordes cian neón
    const panelW = 680;
    const panelH = 260;
    const panelX = (w - panelW) / 2;
    const panelY = (h - panelH) / 2;

    ctx.fillStyle = "rgba(12, 20, 36, 0.95)";
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = "#00f5d4";
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Esquinas reforzadas
    ctx.fillStyle = "#ffea00";
    ctx.fillRect(panelX - 2, panelY - 2, 8, 8);
    ctx.fillRect(panelX + panelW - 6, panelY - 2, 8, 8);
    ctx.fillRect(panelX - 2, panelY + panelH - 6, 8, 8);
    ctx.fillRect(panelX + panelW - 6, panelY + panelH - 6, 8, 8);

    // Cabecera táctica
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = "#00f5d4";
    ctx.textAlign = "left";
    ctx.fillText("TRANSMISIÓN MILITAR TÁCTICA // COMANDO KONTRA #2149", panelX + 24, panelY + 30);
    ctx.fillStyle = "#384869";
    ctx.fillRect(panelX + 24, panelY + 38, panelW - 48, 1);

    // Título de éxito
    ctx.font = '900 22px "Courier New", monospace';
    ctx.fillStyle = "#ffea00";
    ctx.textAlign = "center";
    ctx.fillText("¡SECTOR COMPLETADO!", w / 2, panelY + 75);

    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillStyle = "#00f5d4";
    ctx.fillText("AMENAZA NEUTRALIZADA // COORDENADAS ASEGURADAS", w / 2, panelY + 102);

    // Próximo objetivo
    ctx.fillStyle = "rgba(0, 245, 212, 0.1)";
    ctx.fillRect(panelX + 30, panelY + 120, panelW - 60, 42);
    ctx.strokeStyle = "#00b4d8";
    ctx.strokeRect(panelX + 30, panelY + 120, panelW - 60, 42);

    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillStyle = "#8fa0b8";
    ctx.fillText("DESPLEGANDO ESCUADRÓN EN:", w / 2, panelY + 138);

    const glowPulse = Math.floor(t / 8) % 2 === 0;
    ctx.fillStyle = glowPulse ? "#ffffff" : "#00f5d4";
    ctx.font = '900 14px "Courier New", monospace';
    ctx.fillText(nextName, w / 2, panelY + 154);

    // Estadísticas
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillStyle = "#e2e8f0";
    const scoreStr = manager.score.toString().padStart(6, "0");
    ctx.fillText(`PUNTOS: ${scoreStr}   |   GEMAS: ${manager.player.gems}   |   VIDAS: ${manager.player.lives}`, w / 2, panelY + 195);

    // Barra de carga de inserción
    const progress = Math.min(1, Math.max(0, (t - 20) / 140));
    const barW = 340;
    const barHgt = 10;
    const barX = (w - barW) / 2;
    const barY = panelY + 215;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(barX, barY, barW, barHgt);
    ctx.fillStyle = "#00f5d4";
    ctx.fillRect(barX, barY, barW * progress, barHgt);

    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = "#8fa0b8";
    ctx.textAlign = "center";
    ctx.fillText(`CARGANDO INSERCIÓN TÁCTICA... ${Math.round(progress * 100)}%`, w / 2, barY + 24);

    ctx.restore();
  }

  static drawVictoryCinematic(manager) {
    const ctx = manager.ctx;
    const w = manager.canvas.width;
    const h = manager.canvas.height;
    const t = manager.victoryTimer;

    ctx.save();
    ctx.fillStyle = "rgba(5, 8, 17, 0.92)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = '900 28px "Courier New", monospace';
    ctx.fillStyle = "#ffea00";
    ctx.textAlign = "center";
    ctx.fillText("¡MISIÓN CUMPLIDA!", w / 2, 120);

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = "#00f5d4";
    ctx.fillText("EL NÚCLEO DE OMEGA PRIME HA SIDO DESTRUIDO", w / 2, 160);
    ctx.fillText(
      "LA TIERRA ESTÁ A SALVO // ESCUADRÓN KONTRA VICTORIOSO",
      w / 2,
      190,
    );

    ctx.fillStyle = "#8fa0b8";
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText(
      "PUNTUACIÓN FINAL: " + manager.score.toString().padStart(6, "0"),
      w / 2,
      250,
    );
    ctx.fillText("ESMERALDAS: " + manager.player.gems, w / 2, 280);

    ctx.restore();
  }
}
