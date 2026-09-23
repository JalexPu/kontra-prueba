// play-scene.js - Escena Principal de Juego KONTRA integrada con Phaser 3

class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
  }

  create() {
    const canvas = this.sys.game.canvas;
    canvas.id = "gameCanvas";

    // Instanciar motor de juego
    window.__kontraManager = new LevelManager(canvas);
    this.manager = window.__kontraManager;

    // Conectar eventos del juego con Phaser
    this.manager.onPauseChange = (isPaused, stats) => {
      if (isPaused) {
        this.scene.launch("Pause", { stats });
      } else {
        this.scene.stop("Pause");
      }
    };

    this.manager.onGameOver = (isVictory, stats) => {
      this.scene.start("GameOver", { isVictory, stats });
    };

    // Botón de Pausa flotante en Phaser (esquina superior derecha)
    this.pauseBtn = this.add
      .text(820, 15, "⏸", {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "20px",
        color: "#00f5d4",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    this.pauseBtn.on("pointerover", () => {
      this.pauseBtn.setColor("#ffea00");
    });
    this.pauseBtn.on("pointerout", () => {
      this.pauseBtn.setColor("#00f5d4");
    });
    this.pauseBtn.on("pointerdown", () => {
      if (this.manager) this.manager.togglePause();
    });

    this.events.on("shutdown", () => {
      if (this.manager && typeof this.manager.destroy === "function") {
        this.manager.destroy();
      }
    });

    this.events.on("destroy", () => {
      if (this.manager && typeof this.manager.destroy === "function") {
        this.manager.destroy();
      }
    });
  }

  update(time) {
    if (this.manager) {
      this.manager.gameLoop(time);
    }
  }

  shutdown() {
    if (this.manager && typeof this.manager.destroy === "function") {
      this.manager.destroy();
    }
  }
}
