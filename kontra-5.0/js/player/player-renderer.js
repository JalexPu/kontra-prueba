// player-renderer.js - Sistema Visual y Renderizado del Soldado Protagonista

class PlayerRenderer {
  static draw(player, ctx) {
    if (player.isDead) return;

    ctx.save();
    if (player.invulnerableTimer > 0) {
      ctx.globalAlpha = 0.8;
    }
    const centerX = Math.floor(player.x + player.width / 2);
    const bottomY = Math.floor(player.y + player.height);

    // Sombra proyectada en el suelo
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    const shadowScale = player.onGround ? 1 : 0.65;
    const shadowW = player.isCrouching ? 22 : 14;
    ctx.ellipse(
      centerX,
      bottomY - 2,
      shadowW * shadowScale,
      4 * shadowScale,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.translate(centerX, bottomY);

    // Voltereta acrobática en salto
    if (!player.onGround) {
      ctx.translate(0, -player.height / 2);
      ctx.rotate(player.rollAngle);
      ctx.translate(0, player.height / 2);
    }

    // Orientación horizontal
    if (player.direction === -1) {
      ctx.scale(-1, 1);
    }

    if (player.spriteLoaded) {
      if (player.isCrouching) {
        // Postura cuerpo a tierra de Contra
        const f = player.crouchFrame;
        ctx.drawImage(player.sprite, f.sx, f.sy, f.sw, f.sh, -26, -30, 52, 28);
      } else if (!player.onGround) {
        // Salto voltereta
        const jf =
          player.jumpFrames[
            Math.floor(Math.abs(player.rollAngle) * 1.5) %
              player.jumpFrames.length
          ];
        ctx.drawImage(
          player.sprite,
          jf.sx,
          jf.sy,
          jf.sw,
          jf.sh,
          -18,
          -42,
          36,
          36,
        );
      } else if (Math.abs(player.vx) > 0.1) {
        // Animación de carrera
        const f =
          player.runFrames[
            Math.floor(player.animIndex) % player.runFrames.length
          ];
        ctx.drawImage(
          player.sprite,
          f.sx,
          f.sy,
          f.sw,
          f.sh,
          -20,
          -52,
          f.sw * 1.25,
          f.sh * 1.25,
        );
      } else {
        // Postura estática
        const f = player.idleFrame;
        ctx.drawImage(
          player.sprite,
          f.sx,
          f.sy,
          f.sw,
          f.sh,
          -18,
          -50,
          f.sw * 1.25,
          f.sh * 1.25,
        );
      }
    } else {
      // Dibujo de reserva vectorial
      ctx.fillStyle = "#1c6dd0";
      ctx.fillRect(
        -player.width / 2,
        -player.height / 2,
        player.width,
        player.height / 2,
      );
      ctx.fillStyle = "#e0a96d";
      ctx.fillRect(
        -player.width / 2 + 4,
        -player.height,
        player.width - 8,
        player.height * 0.45,
      );
    }

    ctx.restore();

    // Notificación flotante de arma recogida
    if (player.weaponNoticeTimer > 0) {
      const curW = player.weapons[player.currentWeaponKey];
      if (curW) {
        ctx.save();
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.fillStyle = curW.color;
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 6;
        ctx.fillText(player.weaponNotice, centerX, player.y - 18);
        ctx.restore();
      }
    }
  }
}
