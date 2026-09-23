// controls-scene.js - Escena de Guía de Controles Arcade

class ControlsScene extends BaseMenuScene {
  constructor() {
    super("Controls");
  }

  create() {
    this.createRetroGridBackground();

    this.add
      .text(840 / 2, 38, "CONTROLES DE COMBATE // ARCADE", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "22px",
        fontStyle: "bold",
        color: "#c084fc",
      })
      .setOrigin(0.5);

    const box = this.add.graphics();
    box.fillStyle(0x0c121e, 0.94);
    box.fillRoundedRect(70, 70, 700, 280, 8);
    box.lineStyle(2, 0xa855f7, 0.8);
    box.strokeRoundedRect(70, 70, 700, 280, 8);

    const controls = [
      { key: "A  D  /  ← →", desc: "Moverse a la izquierda / derecha" },
      { key: "S  /  ↓", desc: "Agacharse" },
      { key: "ESPACIO / W", desc: "Saltar / Salto en el aire" },
      { key: "RATÓN", desc: "Apuntar con la mira táctica" },
      { key: "CLIC IZQ / Z", desc: "Disparar ráfaga de plasma" },
      { key: "B", desc: "Lanzar Bomba de área destructiva" },
      { key: "P / ESC", desc: "Pausar / Opciones de combate" },
      { key: "R", desc: "Reiniciar sector" },
    ];

    let rowY = 100;
    controls.forEach((c) => {
      this.add
        .text(120, rowY, `[ ${c.key} ]`, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "13px",
          fontStyle: "bold",
          color: "#00f5d4",
        })
        .setOrigin(0, 0.5);

      this.add
        .text(340, rowY, c.desc, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "13px",
          color: "#e2e8f0",
        })
        .setOrigin(0, 0.5);

      rowY += 28;
    });

    this.createButton(
      840 / 2,
      395,
      "◀ VOLVER AL MENÚ",
      () => {
        this.scene.start("Menu");
      },
      {
        primaryColor: 0xa855f7,
        bgColor: 0x1f102d,
        hoverBg: 0xa855f7,
        textColor: "#c084fc",
        hoverTextColor: "#060d17",
        width: 240,
        height: 40,
      },
    );
  }
}
