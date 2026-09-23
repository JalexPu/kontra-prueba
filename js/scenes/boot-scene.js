// boot-scene.js - Escena de Carga Inicial de Recursos y Sprites

class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    const width = 840;
    const height = 460;

    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x070b14, 1);
    progressBg.fillRect(0, 0, width, height);

    this.add
      .text(width / 2, height / 2 - 50, "KONTRA // CARGANDO RECURSOS...", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "20px",
        fontStyle: "bold",
        color: "#00f5d4",
      })
      .setOrigin(0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.lineStyle(2, 0x00f5d4, 0.8);
    progressBox.strokeRect(width / 2 - 160, height / 2, 320, 24);

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xff3300, 1);
      progressBar.fillRect(width / 2 - 156, height / 2 + 4, 312 * value, 16);
    });

    // Carga de texturas e imágenes del juego
    this.load.image("ply1", "assets/img/ply1.png");
    this.load.image("ply2", "assets/img/ply2.png");
    this.load.image("esmeralda", "assets/img/esmeralda.png");
    this.load.image("escopeta", "assets/img/escopeta.png");
    this.load.image("escopeta2", "assets/img/escopeta2.png");
    this.load.image("escopeta3", "assets/img/escopeta3.png");
    this.load.image("rifle", "assets/img/rifle.png");
    this.load.image("rifle2", "assets/img/rifle2.png");
    this.load.image("subfusil", "assets/img/subfusil.png");
    this.load.image("subfusil2", "assets/img/subfusil2.png");
    this.load.image("9mm", "assets/img/9mm.png");
    this.load.image("fondo_guerra", "assets/img/fondo_guerra.webp");
    this.load.image("portada", "assets/img/portada.jpg");
    this.load.image("disparo", "assets/img/disparo.png");
    this.load.image("ruinas_ciudad", "assets/img/ruinas_ciudad.png");

    this.load.on("loaderror", (file) => {
      console.warn("[KONTRA] Asset opcional no encontrado:", file.src);
    });
  }

  create() {
    this.scene.start("Menu");
  }
}
