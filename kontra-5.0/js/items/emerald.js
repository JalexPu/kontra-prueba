// emerald.js - Ítem Coleccionable de Esmeralda / Gema

class Emerald {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 28;
    this.height = 24;
    this.toRemove = false;
    this.floatAngle = Math.random() * Math.PI * 2;

    this.image = new Image();
    this.loaded = false;
    this.image.onload = () => {
      this.loaded = true;
    };
    this.image.src = "assets/img/esmeralda.png";
  }

  update() {
    this.floatAngle += 0.05;
    this.y = this.baseY + Math.sin(this.floatAngle) * 5;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.baseY + 28,
      10,
      3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.fillStyle = "rgba(0, 245, 212, 0.25)";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      18,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    if (this.loaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "#00f5d4";
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height * 0.4);
      ctx.lineTo(this.x + this.width / 2, this.y + this.height);
      ctx.lineTo(this.x, this.y + this.height * 0.4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}
