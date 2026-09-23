// camera-system.js - Sistema de Cámara Dinámica, Seguimiento de Jugador y Vibración de Pantalla

class CameraSystem {
  static update(manager) {
    const player = manager.player;

    // Seguimiento dinámico de cámara según el sector
    if (manager.currentLevel >= 1 && manager.currentLevel <= 3) {
      const lookAheadX = player.vx * 18;
      const targetCamX =
        player.x + player.width / 2 - manager.canvas.width * 0.42 + lookAheadX;
      const targetCamY =
        player.y + player.height / 2 - manager.canvas.height * 0.58;

      manager.cameraX += (targetCamX - manager.cameraX) * 0.12;
      manager.cameraY += (targetCamY - manager.cameraY) * 0.08;

      // Límites del mapa
      if (manager.cameraX < 0) manager.cameraX = 0;
      if (manager.cameraX > manager.mapWidth - manager.canvas.width) {
        manager.cameraX = manager.mapWidth - manager.canvas.width;
      }
      if (manager.cameraY < -30) manager.cameraY = -30;
      if (manager.cameraY > 50) manager.cameraY = 50;
    } else {
      // Sector 4 (Arena del Jefe): Cámara centrada
      const targetCamX = (manager.mapWidth - manager.canvas.width) / 2;
      manager.cameraX += (targetCamX - manager.cameraX) * 0.08;
      manager.cameraY = 0;
    }

    // Amortiguación de vibración de pantalla (Screen Shake)
    if (manager.screenShake > 0) {
      manager.screenShake *= 0.88;
      if (manager.screenShake < 0.2) manager.screenShake = 0;
    }
  }

  static addShake(manager, amount) {
    manager.screenShake = Math.max(manager.screenShake, amount);
  }
}
