// game-config.js - Configuración Centralizada y Balance del Juego Kontra

const GameConfig = {
  // Dimensiones del juego
  canvas: {
    width: 900,
    height: 480,
  },

  // Parámetros del Jugador
  player: {
    initialLives: 3,
    maxLives: 5,
    maxHealth: 100,
    initialBombs: 3,
    maxBombs: 5,
    speed: 2.05,
    accel: 0.36,
    friction: 0.86,
    jumpForce: -10.3,
    gravity: 0.42,
    extraLifeScore: 15000,
  },

  // Puntuaciones
  scoring: {
    gruntEnemy: 100,
    sniperEnemy: 150,
    turret: 300,
    drone: 200,
    miniBoss: 3000,
    bossRobot: 10000,
    emerald: 250,
  },

  // Paleta de Colores Retro Arcade
  colors: {
    primaryGreen: "#00f5d4",
    dangerRed: "#ff0055",
    warningYellow: "#ffe600",
    cyberBlue: "#00b4d8",
    darkBackground: "#0d0f18",
  },
};
