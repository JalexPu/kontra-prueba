# 🕹️ KONTRA - Retro Action Arcade Shooter

Juego de acción y plataformas retro estilo Arcade/Contra, desarrollado con arquitectura modular en **JavaScript** y **Phaser 3**.

---

## 👥 Integrantes del Proyecto (GRUPO 4)

- **Jonathan Paredes** - Lógica de Juego & Físicas
- **Fabrizzio Saquicela** - Diseño Visual & Escenas Phaser 3
- **Alan Zuñiga** - Sistema de Audio & Combate

---

## 🎮 Controles del Juego

| Tecla / Control                                       | Acción                       |
| :---------------------------------------------------- | :--------------------------- |
| <kbd>A</kbd> <kbd>D</kbd> / <kbd>←</kbd> <kbd>→</kbd> | Moverse horizontalmente      |
| <kbd>S</kbd> / <kbd>↓</kbd>                           | Agacharse (cuerpo a tierra)  |
| <kbd>ESPACIO</kbd> / <kbd>W</kbd>                     | Saltar (con voltereta aérea) |
| <kbd>RATÓN</kbd>                                      | Apuntar 360°                 |
| <kbd>CLIC IZQ</kbd> / <kbd>Z</kbd>                    | Disparar arma actual         |
| <kbd>B</kbd>                                          | Lanzar Bomba de Área         |
| <kbd>P</kbd> / <kbd>ESC</kbd>                         | Pausar / Reanudar            |
| <kbd>R</kbd>                                          | Reiniciar nivel              |

---

## 📂 Arquitectura y Estructura del Código

El código está organizado en carpetas pequeñas y amigables con responsabilidades bien delimitadas:

```
project/
├── index.html                       # HTML limpio y carga ordenada de dependencias
├── mapa.json                        # Definición de plataformas y coordenadas
├── css/
│   └── style.css                    # Gabinete arcade retro y filtro CRT
├── assets/
│   └── img/                         # Sprites, texturas y fondos parallax
└── js/
    ├── main.js                      # Configuración de Phaser 3 y registro de escenas
    │
    ├── config/                      # ⚙️ Configuración y Balance Global
    │   └── game-config.js           # Vidas, velocidades, daño, puntuaciones y colores
    │
    ├── audio/                       # 🔊 Síntesis de Sonido
    │   └── retro-audio.js           # Efectos de sonido arcade generados por Web Audio
    │
    ├── player/                      # 🏃 Soldado Protagonista
    │   ├── player.js                # Físicas, inercia, salto y colisiones
    │   ├── player-renderer.js       # Animaciones de spritesheet y dibujo
    │   └── weapon-system.js         # Tipos de armas (Pistola, Escopeta, Plasma, Subfusil)
    │
    ├── enemies/                     # 👾 Enemigos y Jefes
    │   ├── enemy.js                 # Soldados rasos y francotiradores
    │   ├── turret.js                # Torretas giratorias automatizadas
    │   ├── drone.js                 # Drones aéreos de ataque
    │   ├── war-plane.js             # Aviones de combate en fondo parallax
    │   ├── mini-boss.js             # Mini jefe blindado del Glaciar
    │   ├── boss-robot.js            # IA y patrones de ataque del Jefe Omega Prime
    │   └── boss-renderer.js         # Dibujo vectorial del Mecha Omega Prime
    │
    ├── items/                       # 💎 Coleccionables y Power-Ups
    │   ├── emerald.js               # Esmeraldas de puntuación
    │   ├── weapon-pickup.js         # Ítems para cambiar de arma
    │   ├── heart-item.js            # Botiquines de curación / vidas
    │   └── bomb-pickup.js           # Recargas de bombas de área
    │
    ├── entities/                    # 💥 Proyectiles y Efectos
    │   ├── bullet.js                # Proyectiles aliados y enemigos
    │   ├── bomb.js                  # Bombas con onda expansiva
    │   └── particle.js              # Chispas, humo y explosiones
    │
    ├── core/                        # 🧠 Motor del Nivel
    │   ├── mapa-data.js             # Geometría y coordenadas del mapa
    │   ├── camera-system.js         # Seguimiento suave y screen shake
    │   ├── input-system.js          # Control de teclado y ratón
    │   ├── cinematic-system.js      # Cinemáticas de jefe y victoria
    │   ├── level-builder.js         # Generador de los 4 sectores del juego
    │   ├── collision-system.js      # Físicas, impactos y recolección
    │   ├── level-renderer.js        # Fondos parallax, HUD y plataformas
    │   └── level-manager.js         # Coordinador principal ligero
    │
    └── scenes/                      # 🎬 Escenas Nativas de Phaser 3
        ├── base-scene.js            # Botones interactivos con sonido
        ├── boot-scene.js            # Barra de carga arcade
        ├── menu-scene.js            # Menú principal con efectos de partículas
        ├── story-scene.js           # Misión / Lore militar #2149
        ├── credits-scene.js         # Tarjetas interactivas del Grupo 4
        ├── controls-scene.js        # Guía visual de controles
        ├── play-scene.js            # Escena del juego y loop de combate
        ├── pause-scene.js           # Menú de pausa con estadísticas
        └── gameover-scene.js        # Pantalla de Game Over y Victoria
```

---

## 🛠️ Tecnologías Utilizadas

- **Phaser 3** (Gestión de escenas, menús interactivos, inputs y ciclo de vida).
- **HTML5 Canvas 2D** (Renderizado retro de alta tasa de cuadros).
- **Web Audio API** (Sintetizador en tiempo real de 8 bits sin dependencias de archivos de audio pesados).
