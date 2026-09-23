// main.js - Punto de Entrada e Inicialización de Phaser 3 para KONTRA

window.addEventListener("DOMContentLoaded", () => {
  const config = {
    type: Phaser.CANVAS,
    width: 840,
    height: 460,
    parent: "gameCanvasWrap",
    backgroundColor: "#0b131f",
    banner: false,
    scene: [
      BootScene,
      MenuScene,
      StoryScene,
      CreditsScene,
      ControlsScene,
      PlayScene,
      PauseScene,
      GameOverScene,
    ],
  };

  const game = new Phaser.Game(config);

  // Renderizado del motor de juego sobre el canvas durante PlayScene
  game.events.on("postrender", () => {
    const playScene = game.scene.getScene("Play");
    if (playScene && playScene.scene.isActive()) {
      if (window.__kontraManager) {
        window.__kontraManager.render();
      }
    }
  });
});
