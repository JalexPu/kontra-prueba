// menu-scene.js - Menú Principal Arcade del Juego KONTRA

class MenuScene extends BaseMenuScene {
  constructor() {
    super("Menu");
  }

  create() {
    this.createRetroGridBackground();

    // Efecto de partículas / chispas flotantes
    const particles = this.add.graphics();
    const sparks = [];
    for (let i = 0; i < 25; i++) {
      sparks.push({
        x: Phaser.Math.Between(20, 820),
        y: Phaser.Math.Between(20, 440),
        size: Phaser.Math.Between(1, 3),
        speedY: Phaser.Math.FloatBetween(-0.8, -0.2),
        alpha: Phaser.Math.FloatBetween(0.3, 0.9),
      });
    }

    this.time.addEvent({
      delay: 30,
      loop: true,
      callback: () => {
        particles.clear();
        for (const s of sparks) {
          s.y += s.speedY;
          if (s.y < 0) s.y = 460;
          particles.fillStyle(0x00f5d4, s.alpha);
          particles.fillRect(s.x, s.y, s.size, s.size);
        }
      },
    });

    // Insignia Superior
    const badgeBg = this.add.graphics();
    badgeBg.fillStyle(0xff3300, 0.18);
    badgeBg.fillRoundedRect(840 / 2 - 180, 24, 360, 26, 4);
    badgeBg.lineStyle(1, 0xff3300, 0.7);
    badgeBg.strokeRoundedRect(840 / 2 - 180, 24, 360, 26, 4);

    this.add
      .text(840 / 2, 37, "EXPEDIENTE MILITAR #2149 // PHASER 3", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "12px",
        fontStyle: "bold",
        color: "#ffaa00",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    // Título Principal KONTRA con brillo
    const titleText = this.add
      .text(840 / 2, 90, "KONTRA", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "56px",
        fontStyle: "900",
        color: "#ffea00",
        align: "center",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: titleText,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Subtítulo
    this.add
      .text(840 / 2, 134, "LA ÚLTIMA LÍNEA DE DEFENSA DE LA HUMANIDAD", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "13px",
        fontStyle: "bold",
        color: "#00f5d4",
      })
      .setOrigin(0.5);

    // Botones de acción en Phaser
    const btnYStart = 190;
    const btnGap = 48;

    // 1. INICIAR MISIÓN
    this.createButton(
      840 / 2,
      btnYStart,
      "▶ INICIAR MISIÓN",
      () => {
        this.scene.start("Play");
      },
      {
        primaryColor: 0x00f5d4,
        bgColor: 0x0e2429,
        hoverBg: 0x00f5d4,
        textColor: "#00f5d4",
        hoverTextColor: "#060d17",
        width: 280,
        height: 40,
      },
    );

    // 2. HISTORIA / EXPEDIENTE
    this.createButton(
      840 / 2,
      btnYStart + btnGap,
      "📜 HISTORIA / LORE",
      () => {
        this.scene.start("Story");
      },
      {
        primaryColor: 0xffaa00,
        bgColor: 0x241c0e,
        hoverBg: 0xffaa00,
        textColor: "#ffaa00",
        hoverTextColor: "#060d17",
        width: 280,
        height: 40,
      },
    );

    // 3. CRÉDITOS (GRUPO 4)
    this.createButton(
      840 / 2,
      btnYStart + btnGap * 2,
      "👥 CRÉDITOS (GRUPO 4)",
      () => {
        this.scene.start("Credits");
      },
      {
        primaryColor: 0x38bdf8,
        bgColor: 0x0e1c2b,
        hoverBg: 0x38bdf8,
        textColor: "#38bdf8",
        hoverTextColor: "#060d17",
        width: 280,
        height: 40,
      },
    );

    // 4. CONTROLES Y AYUDA
    this.createButton(
      840 / 2,
      btnYStart + btnGap * 3,
      "🎮 CONTROLES",
      () => {
        this.scene.start("Controls");
      },
      {
        primaryColor: 0xa855f7,
        bgColor: 0x1f102d,
        hoverBg: 0xa855f7,
        textColor: "#c084fc",
        hoverTextColor: "#060d17",
        width: 280,
        height: 40,
      },
    );

    // Pie de pantalla: mensaje retro parpadeante
    const coinText = this.add
      .text(840 / 2, 425, "★ INSERT COIN // PRESS ENTER OR SPACE TO START ★", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "12px",
        fontStyle: "bold",
        color: "#8fa0b8",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: coinText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Iniciar con Enter o Espacio
    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("Play");
    });
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("Play");
    });
  }
}
