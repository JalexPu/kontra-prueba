// credits-scene.js - Escena de Créditos de los Integrantes del Grupo 4

class CreditsScene extends BaseMenuScene {
  constructor() {
    super("Credits");
  }

  create() {
    this.createRetroGridBackground();

    // Título de Créditos
    this.add
      .text(840 / 2, 38, "INTEGRANTES DEL GRUPO 4", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "24px",
        fontStyle: "900",
        color: "#00f5d4",
      })
      .setOrigin(0.5);

    this.add
      .text(840 / 2, 64, "KONTRA // DEV TEAM - ARQUITECTURA PHASER 3", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "12px",
        fontStyle: "bold",
        color: "#ffaa00",
      })
      .setOrigin(0.5);

    // Tarjetas de los integrantes
    const members = [
      {
        tag: "DEV-01",
        name: "Jonathan Paredes",
        role: "Integrante Grupo 4",
        area: "Arquitectura & Lógica Phaser",
        color: 0x00f5d4,
        icon: "🎮",
      },
      {
        tag: "DEV-02",
        name: "Fabrizzio Saquicela",
        role: "Integrante Grupo 4",
        area: "Diseño & Escenarios",
        color: 0xffaa00,
        icon: "⚡",
      },
      {
        tag: "DEV-03",
        name: "Alan Zuñiga",
        role: "Integrante Grupo 4",
        area: "Físicas & Jugabilidad",
        color: 0xff3366,
        icon: "🎯",
      },
    ];

    const cardWidth = 240;
    const cardHeight = 230;
    const startX = 145;
    const gapX = 275;
    const cardY = 215;

    members.forEach((m, idx) => {
      const cx = startX + idx * gapX;
      const card = this.add.container(cx, cardY);

      // Fondo tarjeta
      const bg = this.add.graphics();
      bg.fillStyle(0x0c1424, 0.95);
      bg.fillRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        8,
      );
      bg.lineStyle(2, m.color, 0.8);
      bg.strokeRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        8,
      );

      // Header de la tarjeta
      bg.fillStyle(m.color, 0.15);
      bg.fillRoundedRect(
        -cardWidth / 2 + 6,
        -cardHeight / 2 + 6,
        cardWidth - 12,
        32,
        4,
      );

      // Badge
      const badgeText = this.add
        .text(-cardWidth / 2 + 14, -cardHeight / 2 + 15, m.tag, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "11px",
          fontStyle: "bold",
          color: "#ffffff",
        })
        .setOrigin(0, 0.5);

      const statusText = this.add
        .text(cardWidth / 2 - 14, -cardHeight / 2 + 15, "● ACTIVO", {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "10px",
          fontStyle: "bold",
          color: "#00f5d4",
        })
        .setOrigin(1, 0.5);

      // Icono de Avatar
      const iconText = this.add
        .text(0, -25, m.icon, {
          fontSize: "36px",
          align: "center",
        })
        .setOrigin(0.5);

      // Nombre
      const nameText = this.add
        .text(0, 25, m.name, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "15px",
          fontStyle: "bold",
          color: "#ffffff",
          align: "center",
        })
        .setOrigin(0.5);

      // Rol
      const roleText = this.add
        .text(0, 52, m.role, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "12px",
          color: "#ffaa00",
          align: "center",
        })
        .setOrigin(0.5);

      // Especialidad
      const areaText = this.add
        .text(0, 78, m.area, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "11px",
          color: "#8fa0b8",
          align: "center",
        })
        .setOrigin(0.5);

      card.add([
        bg,
        badgeText,
        statusText,
        iconText,
        nameText,
        roleText,
        areaText,
      ]);

      // Animación suave de flotación
      this.tweens.add({
        targets: card,
        y: cardY - 5,
        duration: 1800 + idx * 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // Botón Volver
    this.createButton(
      840 / 2,
      395,
      "◀ VOLVER AL MENÚ PRINCIPAL",
      () => {
        this.scene.start("Menu");
      },
      {
        primaryColor: 0x00f5d4,
        bgColor: 0x0d1f2d,
        hoverBg: 0x00f5d4,
        textColor: "#00f5d4",
        hoverTextColor: "#060d17",
        width: 300,
        height: 40,
      },
    );
  }
}
