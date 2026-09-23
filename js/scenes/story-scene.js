// story-scene.js - Escena de Historia y Expediente Militar #2149

class StoryScene extends BaseMenuScene {
  constructor() {
    super("Story");
  }

  create() {
    this.createRetroGridBackground();

    // Contenedor principal estilo informe militar
    const box = this.add.graphics();
    box.fillStyle(0x0c121e, 0.94);
    box.fillRoundedRect(35, 20, 770, 420, 8);
    box.lineStyle(2, 0xff3300, 0.85);
    box.strokeRoundedRect(35, 20, 770, 420, 8);

    // Cabecera
    this.add
      .text(840 / 2, 45, "EXPEDIENTE MILITAR #2149 // ESCUADRÓN KONTRA", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#ffaa00",
      })
      .setOrigin(0.5);

    this.add
      .text(840 / 2, 68, "INFORME DE INTELIGENCIA CLASIFICADO", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "12px",
        color: "#ff3300",
      })
      .setOrigin(0.5);

    // Imagen de portada si existe
    if (this.textures.exists("portada")) {
      const img = this.add.image(160, 220, "portada");
      img.setDisplaySize(190, 240);
      const border = this.add.graphics();
      border.lineStyle(2, 0xffaa00, 0.8);
      border.strokeRect(65, 100, 190, 240);
    }

    // Texto de la historia
    const storyX = 300;
    const storyY = 105;

    const storyParagraphs = [
      "LA GUERRA TERMINÓ... LA RESISTENCIA COMIENZA.",
      "",
      "AÑO 2149: La inteligencia artificial militar OMEGA tomó el",
      "control de las instalaciones de defensa global. Las ciudades",
      "cayeron en cuestión de días y los ejércitos fueron aniquilados.",
      "",
      "Tú eres el último soldado operativo del escuadrón de élite",
      "KONTRA. Equipado con armamento de plasma experimental, deberás",
      "cruzar las ruinas urbanas e infiltrar la fortaleza central.",
      "",
      "MISIÓN FINAL: Destruir al autómata central OMEGA PRIME y",
      "recuperar la Tierra.",
    ];

    let currentY = storyY;
    storyParagraphs.forEach((line, index) => {
      const isHeader = index === 0;
      const isMission = line.startsWith("MISIÓN FINAL");
      this.add.text(storyX, currentY, line, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: isHeader ? "14px" : isMission ? "13px" : "12px",
        fontStyle: isHeader || isMission ? "bold" : "normal",
        color: isHeader ? "#00f5d4" : isMission ? "#ffea00" : "#d0dceb",
        lineSpacing: 4,
      });
      currentY += isHeader || isMission ? 20 : 16;
    });

    // Botones de acción
    this.createButton(
      420,
      395,
      "▶ DESPLEGAR MISIÓN",
      () => {
        this.scene.start("Play");
      },
      {
        primaryColor: 0x00f5d4,
        bgColor: 0x0d2824,
        hoverBg: 0x00f5d4,
        textColor: "#00f5d4",
        hoverTextColor: "#060d17",
        width: 220,
        height: 38,
      },
    );

    this.createButton(
      660,
      395,
      "◀ VOLVER AL MENÚ",
      () => {
        this.scene.start("Menu");
      },
      {
        primaryColor: 0x8fa0b8,
        bgColor: 0x171e2e,
        hoverBg: 0x8fa0b8,
        textColor: "#cbd5e1",
        hoverTextColor: "#060d17",
        width: 190,
        height: 38,
      },
    );
  }
}
