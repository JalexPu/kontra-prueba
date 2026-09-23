// boss-renderer.js - Motor Visual y Renderizado del Jefe Robot Omega Prime

class BossRenderer {
  static draw(boss, ctx) {
    ctx.save();
    ctx.translate(Math.floor(boss.x), Math.floor(boss.y));

    // 1. Llamaradas de los propulsores inferiores
    const flameHeight = Math.random() * 12 + 16 + (boss.isBerserk ? 8 : 0);
    const flameWidth = 14;
    const t1X = 22;
    const t2X = boss.width - 22;
    const tY = boss.height - 4;

    [t1X, t2X].forEach((tx) => {
      const grad = ctx.createLinearGradient(tx, tY, tx, tY + flameHeight);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.2, "#00f5d4");
      grad.addColorStop(0.6, "#ff3300");
      grad.addColorStop(1, "rgba(255, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(tx - flameWidth / 2, tY);
      ctx.lineTo(tx + (Math.random() - 0.5) * 4, tY + flameHeight);
      ctx.lineTo(tx + flameWidth / 2, tY);
      ctx.closePath();
      ctx.fill();
    });

    // 2. Cañones articulados de plasma en los brazos
    this.drawArmCannon(boss, ctx, 12, 42, boss.armAngle);
    this.drawArmCannon(boss, ctx, boss.width - 12, 42, boss.armAngle);

    // 3. Chasis y Blindaje del Mecha
    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(18, 12, boss.width - 36, boss.height - 18);

    ctx.fillStyle =
      boss.damageFlashTimer > 0
        ? "#ffffff"
        : boss.isBerserk
          ? "#3a151b"
          : "#1c2436";
    ctx.strokeStyle = boss.isBerserk ? "#ff0033" : "#384869";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(20, 16);
    ctx.lineTo(boss.width - 20, 16);
    ctx.lineTo(boss.width - 12, 40);
    ctx.lineTo(boss.width - 18, boss.height - 10);
    ctx.lineTo(18, boss.height - 10);
    ctx.lineTo(12, 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hombreras con franjas de advertencia militar
    ctx.fillStyle = boss.damageFlashTimer > 0 ? "#ffffff" : "#c9182b";
    ctx.fillRect(8, 14, 20, 18);
    ctx.fillRect(boss.width - 28, 14, 20, 18);

    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(10, 16, 4, 14);
    ctx.fillRect(18, 16, 4, 14);
    ctx.fillRect(boss.width - 26, 16, 4, 14);
    ctx.fillRect(boss.width - 18, 16, 4, 14);

    // Carcasa de los propulsores
    ctx.fillStyle = "#121824";
    ctx.fillRect(t1X - 9, boss.height - 10, 18, 8);
    ctx.fillRect(t2X - 9, boss.height - 10, 18, 8);
    ctx.strokeStyle = "#485c7b";
    ctx.strokeRect(t1X - 9, boss.height - 10, 18, 8);
    ctx.strokeRect(t2X - 9, boss.height - 10, 18, 8);

    // 4. Núcleo Cuántico Central (Reactor del Pecho)
    const coreCenterX = boss.width / 2;
    const coreCenterY = 50;
    const coreRadius = 14;

    ctx.fillStyle = "#0e141f";
    ctx.beginPath();
    ctx.arc(coreCenterX, coreCenterY, coreRadius + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = boss.isBerserk ? "#ff0033" : "#00f5d4";
    ctx.lineWidth = 2;
    ctx.stroke();

    const pulse = Math.sin(boss.corePulse) * 3;
    const coreGrad = ctx.createRadialGradient(
      coreCenterX,
      coreCenterY,
      2,
      coreCenterX,
      coreCenterY,
      coreRadius + pulse,
    );
    if (boss.isBerserk) {
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.4, "#ff0033");
      coreGrad.addColorStop(1, "rgba(255, 0, 50, 0.1)");
    } else {
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.4, "#00f5d4");
      coreGrad.addColorStop(1, "rgba(0, 245, 212, 0.1)");
    }
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(coreCenterX, coreCenterY, coreRadius + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 5. Cabeza y Visor Óptico de Escaneo
    const headX = boss.width / 2 - 20;
    const headY = 4;
    const headW = 40;
    const headH = 18;

    ctx.fillStyle = boss.damageFlashTimer > 0 ? "#ffffff" : "#253046";
    ctx.fillRect(headX, headY, headW, headH);
    ctx.strokeStyle = "#4f6488";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(headX, headY, headW, headH);

    // Antena
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boss.width / 2, headY);
    ctx.lineTo(boss.width / 2, headY - 8);
    ctx.stroke();
    ctx.fillStyle =
      Math.floor(boss.hoverTime * 10) % 2 === 0 ? "#ff0033" : "#550000";
    ctx.beginPath();
    ctx.arc(boss.width / 2, headY - 9, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = "#080a10";
    ctx.fillRect(headX + 4, headY + 5, headW - 8, 8);

    // Ojo láser móvil
    const eyePosX = boss.width / 2 + boss.eyeX;
    ctx.fillStyle = "#ff0033";
    ctx.fillRect(eyePosX - 4, headY + 6, 8, 6);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(eyePosX - 1.5, headY + 7.5, 3, 3);

    ctx.restore();
  }

  static drawArmCannon(boss, ctx, pivotX, pivotY, angle) {
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle);

    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = boss.damageFlashTimer > 0 ? "#ffffff" : "#1e293b";
    ctx.fillRect(2, -6, 28, 12);
    ctx.strokeStyle = "#475569";
    ctx.strokeRect(2, -6, 28, 12);

    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(26, -7, 6, 14);

    ctx.fillStyle = boss.isBerserk ? "#ff0033" : "#00f5d4";
    ctx.fillRect(6, -2, 18, 4);

    ctx.restore();
  }
}
