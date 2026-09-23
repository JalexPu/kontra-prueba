// input-system.js - Manejo de Entrada del Teclado, Ratón y Pantalla Táctil

class InputSystem {
  static init(manager) {
    manager._onKeyDown = (e) => {
      manager.sound.init();
      manager.keys[e.code] = true;

      if (e.code === "KeyP" || e.code === "Escape") {
        manager.togglePause();
        return;
      }
      if (manager.isGameOver || manager.isVictory) {
        if (e.code === "KeyR" || e.code === "Enter") {
          manager.restart();
        }
      }
      if (
        e.code === "KeyL" &&
        !manager.isIntro &&
        !manager.isGameOver &&
        !manager.isVictory
      ) {
        if (manager.currentLevel < 4) {
          manager.startLevelTransition();
        } else {
          manager.buildLevel(1);
        }
      }
    };

    manager._onKeyUp = (e) => {
      manager.keys[e.code] = false;
    };

    const updateMousePos = (e) => {
      const rect = manager.canvas.getBoundingClientRect();
      const scaleX = manager.canvas.width / (rect.width || 1);
      const scaleY = manager.canvas.height / (rect.height || 1);
      manager.mouse.x = (e.clientX - rect.left) * scaleX;
      manager.mouse.y = (e.clientY - rect.top) * scaleY;
    };

    manager._onMouseMove = (e) => updateMousePos(e);
    manager._onMouseDown = (e) => {
      manager.sound.init();
      if (e.button === 0) manager.mouse.isDown = true;
    };
    manager._onMouseUp = (e) => {
      if (e.button === 0) manager.mouse.isDown = false;
    };
    manager._onContextMenu = (e) => e.preventDefault();

    window.addEventListener("keydown", manager._onKeyDown);
    window.addEventListener("keyup", manager._onKeyUp);
    manager.canvas.addEventListener("mousemove", manager._onMouseMove);
    manager.canvas.addEventListener("mousedown", manager._onMouseDown);
    window.addEventListener("mouseup", manager._onMouseUp);
    manager.canvas.addEventListener("contextmenu", manager._onContextMenu);

    // Controles táctiles móviles
    manager._onTouchHandler = (e) => {
      manager.sound.init();
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      const rect = manager.canvas.getBoundingClientRect();
      const scaleX = manager.canvas.width / (rect.width || 1);
      const scaleY = manager.canvas.height / (rect.height || 1);
      manager.mouse.x = (touch.clientX - rect.left) * scaleX;
      manager.mouse.y = (touch.clientY - rect.top) * scaleY;
      manager.mouse.isDown = e.type !== "touchend";
    };
    manager.canvas.addEventListener("touchstart", manager._onTouchHandler, {
      passive: true,
    });
    manager.canvas.addEventListener("touchmove", manager._onTouchHandler, {
      passive: true,
    });
    manager.canvas.addEventListener("touchend", manager._onTouchHandler, {
      passive: true,
    });
  }

  static destroy(manager) {
    if (manager._onKeyDown)
      window.removeEventListener("keydown", manager._onKeyDown);
    if (manager._onKeyUp) window.removeEventListener("keyup", manager._onKeyUp);
    if (manager._onMouseMove)
      manager.canvas.removeEventListener("mousemove", manager._onMouseMove);
    if (manager._onMouseDown)
      manager.canvas.removeEventListener("mousedown", manager._onMouseDown);
    if (manager._onMouseUp)
      window.removeEventListener("mouseup", manager._onMouseUp);
    if (manager._onContextMenu)
      manager.canvas.removeEventListener("contextmenu", manager._onContextMenu);
    if (manager._onTouchHandler) {
      manager.canvas.removeEventListener("touchstart", manager._onTouchHandler);
      manager.canvas.removeEventListener("touchmove", manager._onTouchHandler);
      manager.canvas.removeEventListener("touchend", manager._onTouchHandler);
    }
  }
}
