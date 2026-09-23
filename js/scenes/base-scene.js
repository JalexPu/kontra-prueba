// base-scene.js - Audio de UI y Clase Base de Escenas con Botones Interactivos y Fondos Retro

class UIAudio {
  static getCtx() {
    if (!window.__uiAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) window.__uiAudioCtx = new AudioCtx();
    }
    if (window.__uiAudioCtx && window.__uiAudioCtx.state === "suspended") {
      window.__uiAudioCtx.resume();
    }
    return window.__uiAudioCtx;
  }

  static playHover() {
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  static playClick() {
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }
}

class BaseMenuScene extends Phaser.Scene {
  createButton(x, y, text, callback, options = {}) {
    const w = options.width || 240;
    const h = options.height || 42;
    const primaryColor = options.primaryColor ?? 0x00f5d4;
    const bgColor = options.bgColor ?? 0x0d1626;
    const hoverBg = options.hoverBg ?? 0x00f5d4;
    const textColor = options.textColor || "#00f5d4";
    const hoverTextColor = options.hoverTextColor || "#060a12";
    const fontSize = options.fontSize || "15px";

    const container = this.add.container(x, y);

    // Fondo del botón con detalles retro
    const bg = this.add.graphics();
    const drawBg = (isHover) => {
      bg.clear();
      if (isHover) {
        bg.fillStyle(hoverBg, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
        bg.lineStyle(2, 0xffffff, 0.9);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);
      } else {
        bg.fillStyle(bgColor, 0.9);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
        bg.lineStyle(2, primaryColor, 0.8);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);
        // Remaches en las esquinas estilo arcade
        bg.fillStyle(primaryColor, 0.9);
        bg.fillRect(-w / 2 + 3, -h / 2 + 3, 4, 4);
        bg.fillRect(w / 2 - 7, -h / 2 + 3, 4, 4);
        bg.fillRect(-w / 2 + 3, h / 2 - 7, 4, 4);
        bg.fillRect(w / 2 - 7, h / 2 - 7, 4, 4);
      }
    };
    drawBg(false);

    // Texto del botón
    const btnText = this.add
      .text(0, 0, text, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: fontSize,
        fontStyle: "bold",
        color: textColor,
        align: "center",
      })
      .setOrigin(0.5);

    container.add([bg, btnText]);
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });

    container.on("pointerover", () => {
      drawBg(true);
      btnText.setColor(hoverTextColor);
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: "Power1",
      });
      UIAudio.playHover();
    });

    container.on("pointerout", () => {
      drawBg(false);
      btnText.setColor(textColor);
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Power1",
      });
    });

    container.on("pointerdown", () => {
      UIAudio.playClick();
      this.tweens.add({
        targets: container,
        scaleX: 0.96,
        scaleY: 0.96,
        duration: 60,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
      });
    });

    return container;
  }

  createRetroGridBackground() {
    const bg = this.add.graphics();
    bg.fillStyle(0x070b14, 1);
    bg.fillRect(0, 0, 840, 460);

    // Cuadrícula retro azul/cian
    bg.lineStyle(1, 0x142036, 0.6);
    for (let x = 0; x <= 840; x += 40) {
      bg.moveTo(x, 0);
      bg.lineTo(x, 460);
    }
    for (let y = 0; y <= 460; y += 40) {
      bg.moveTo(0, y);
      bg.lineTo(840, y);
    }
    bg.strokePath();

    // Degradado sutil en los bordes
    const vignette = this.add.graphics();
    vignette.lineStyle(6, 0x00f5d4, 0.2);
    vignette.strokeRect(3, 3, 834, 454);
    vignette.lineStyle(2, 0xff3300, 0.3);
    vignette.strokeRect(7, 7, 826, 446);
  }
}
