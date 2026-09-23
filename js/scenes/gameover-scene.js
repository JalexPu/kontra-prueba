// gameover-scene.js - Escena de Fin de Partida: GAME OVER y VICTORIA

class GameOverScene extends BaseMenuScene {
  constructor() {
    super("GameOver");
  }

  create(data) {
    this.createRetroGridBackground();

    const isVictory = data.isVictory || false;
    const stats = data.stats || {
      score: 0,
      gems: 0,
      levelName: "SECTOR FINAL",
    };

    const titleColor = isVictory ? "#00f5d4" : "#ff0033";
    const titleText = isVictory ? "¡MISIÓN CUMPLIDA!" : "GAME OVER";
    const subText = isVictory
      ? "OMEGA PRIME HA SIDO DESTRUIDO // LA TIERRA ESTÁ A SALVO"
      : "SEÑAL PERDIDA // EL SOLDADO KONTRA HA CAÍDO";

    // Título Principal
    const title = this.add
      .text(840 / 2, 75, titleText, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "42px",
        fontStyle: "900",
        color: titleColor,
        align: "center",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add
      .text(840 / 2, 120, subText, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "12px",
        fontStyle: "bold",
        color: isVictory ? "#ffea00" : "#8fa0b8",
      })
      .setOrigin(0.5);

    // Caja de Estadísticas
    const box = this.add.graphics();
    box.fillStyle(0x0c1424, 0.95);
    box.fillRoundedRect(220, 145, 400, 110, 8);
    box.lineStyle(2, isVictory ? 0x00f5d4 : 0xff0033, 0.8);
    box.strokeRoundedRect(220, 145, 400, 110, 8);

    this.add
      .text(260, 175, "PUNTUACIÓN FINAL:", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "14px",
        fontStyle: "bold",
        color: "#8fa0b8",
      })
      .setOrigin(0, 0.5);

    this.add
      .text(580, 175, stats.score.toString().padStart(6, "0"), {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "15px",
        fontStyle: "bold",
        color: "#ffea00",
      })
      .setOrigin(1, 0.5);

    this.add
      .text(260, 215, "ESMERALDAS RECOLECTADAS:", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "14px",
        fontStyle: "bold",
        color: "#8fa0b8",
      })
      .setOrigin(0, 0.5);

    this.add
      .text(580, 215, stats.gems.toString(), {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "15px",
        fontStyle: "bold",
        color: "#00f5d4",
      })
      .setOrigin(1, 0.5);

    // Botones de salida / reinicio
    const btnY = 285;
    const btnGap = 46;

    // 1. REINTENTAR / JUGAR DE NUEVO
    this.createButton(
      840 / 2,
      btnY,
      isVictory ? "▶ JUGAR DE NUEVO" : "🔄 REINTENTAR MISIÓN",
      () => {
        this.scene.start("Play");
      },
      {
        primaryColor: 0x00f5d4,
        bgColor: 0x0d2824,
        hoverBg: 0x00f5d4,
        textColor: "#00f5d4",
        hoverTextColor: "#060d17",
        width: 280,
        height: 38,
      },
    );

    // 2. VER CRÉDITOS
    this.createButton(
      840 / 2,
      btnY + btnGap,
      "👥 VER CRÉDITOS (GRUPO 4)",
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
        height: 38,
      },
    );

    // 3. MENÚ PRINCIPAL
    this.createButton(
      840 / 2,
      btnY + btnGap * 2,
      "🏠 MENÚ PRINCIPAL",
      () => {
        this.scene.start("Menu");
      },
      {
        primaryColor: 0xffaa00,
        bgColor: 0x241c0e,
        hoverBg: 0xffaa00,
        textColor: "#ffaa00",
        hoverTextColor: "#060d17",
        width: 280,
        height: 38,
      },
    );

    // Atajo para reiniciar con R o Enter
    this.input.keyboard.on("keydown-KeyR", () => {
      this.scene.start("Play");
    });
    this.input.keyboard.on("keydown-ENTER", () => {
      this.scene.start("Play");
    });
  }
}
