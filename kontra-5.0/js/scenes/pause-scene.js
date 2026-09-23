// pause-scene.js - Escena y Menú de Pausa Interactivo en Phaser 3

class PauseScene extends BaseMenuScene {
  constructor() {
    super("Pause");
  }

  create(data) {
    const stats = data.stats || {
      levelName: "ZONA 1 - RUINAS",
      score: 0,
      gems: 0,
      health: 100,
      lives: 3,
      weapon: "9MM PISTOL",
    };

    // Fondo semitransparente oscuro
    const overlay = this.add.graphics();
    overlay.fillStyle(0x050811, 0.88);
    overlay.fillRect(0, 0, 840, 460);

    // Tarjeta de pausa
    const box = this.add.graphics();
    box.fillStyle(0x0c1424, 0.96);
    box.fillRoundedRect(170, 40, 500, 380, 8);
    box.lineStyle(2, 0x00f5d4, 0.85);
    box.strokeRoundedRect(170, 40, 500, 380, 8);

    // Cabecera
    this.add
      .text(840 / 2, 72, "KONTRA", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "32px",
        fontStyle: "900",
        color: "#ffea00",
      })
      .setOrigin(0.5);

    this.add
      .text(840 / 2, 105, "SISTEMA EN PAUSA // OPERACIÓN DETENIDA", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "12px",
        fontStyle: "bold",
        color: "#00f5d4",
      })
      .setOrigin(0.5);

    // Estadísticas
    const statItems = [
      { label: "SECTOR:", val: stats.levelName },
      { label: "PUNTUACIÓN:", val: stats.score.toString().padStart(6, "0") },
      { label: "ESMERALDAS:", val: stats.gems.toString() },
      { label: "VIDA / SALUD:", val: `${stats.health}% (${stats.lives} ♥)` },
      { label: "ARMA ACTIVA:", val: stats.weapon },
    ];

    let sY = 145;
    statItems.forEach((s) => {
      this.add
        .text(220, sY, s.label, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "13px",
          fontStyle: "bold",
          color: "#8fa0b8",
        })
        .setOrigin(0, 0.5);

      this.add
        .text(620, sY, s.val, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "13px",
          fontStyle: "bold",
          color: "#ffea00",
        })
        .setOrigin(1, 0.5);

      sY += 26;
    });

    // Botones de acción en Pausa
    const btnY = 295;
    const btnGap = 42;

    // 1. REANUDAR
    this.createButton(
      840 / 2,
      btnY,
      "▶ REANUDAR COMBATE",
      () => {
        if (window.__kontraManager) {
          window.__kontraManager.togglePause(false);
        }
        this.scene.stop("Pause");
      },
      {
        primaryColor: 0x00f5d4,
        bgColor: 0x0d2824,
        hoverBg: 0x00f5d4,
        textColor: "#00f5d4",
        hoverTextColor: "#060d17",
        width: 280,
        height: 36,
      },
    );

    // 2. REINICIAR SECTOR
    this.createButton(
      840 / 2,
      btnY + btnGap,
      "🔄 REINICIAR SECTOR",
      () => {
        this.scene.stop("Pause");
        if (window.__kontraManager) {
          window.__kontraManager.restart();
        }
      },
      {
        primaryColor: 0xffaa00,
        bgColor: 0x241c0e,
        hoverBg: 0xffaa00,
        textColor: "#ffaa00",
        hoverTextColor: "#060d17",
        width: 280,
        height: 36,
      },
    );

    // 3. MENÚ PRINCIPAL
    this.createButton(
      840 / 2,
      btnY + btnGap * 2,
      "🏠 MENÚ PRINCIPAL",
      () => {
        this.scene.stop("Pause");
        this.scene.stop("Play");
        this.scene.start("Menu");
      },
      {
        primaryColor: 0xff3366,
        bgColor: 0x2b0d17,
        hoverBg: 0xff3366,
        textColor: "#ff3366",
        hoverTextColor: "#ffffff",
        width: 280,
        height: 36,
      },
    );

    // Atajo para reanudar con P o Escape
    this.input.keyboard.on("keydown-KeyP", () => {
      if (window.__kontraManager) window.__kontraManager.togglePause(false);
      this.scene.stop("Pause");
    });
    this.input.keyboard.on("keydown-ESC", () => {
      if (window.__kontraManager) window.__kontraManager.togglePause(false);
      this.scene.stop("Pause");
    });
  }
}
