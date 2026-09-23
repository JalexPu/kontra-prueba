// weapon-pickup.js - Ítem de Armas Recogibles (Spread Gun / Escopeta, Rifle de Plasma, Subfusil)

class WeaponPickup {
  constructor(x, y, weaponKey) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.weaponKey = weaponKey;
    this.width = 46;
    this.height = 30;
    this.toRemove = false;
    this.floatAngle = Math.random() * Math.PI * 2;

    this.image = new Image();
    this.loaded = false;
    this.image.onload = () => {
      this.loaded = true;
    };

    if (weaponKey === "shotgun") this.image.src = "assets/img/escopeta.png";
    else if (weaponKey === "rifle") this.image.src = "assets/img/rifle.png";
    else if (weaponKey === "submachine")
      this.image.src = "assets/img/subfusil.png";
    else this.image.src = "assets/img/9mm.png";
  }

  update() {
    this.floatAngle += 0.04;
    this.y = this.baseY + Math.sin(this.floatAngle) * 4;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(20, 25, 45, 0.85)";
    ctx.strokeStyle = "#ffbe0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(
          this.x - 4,
          this.y - 4,
          this.width + 8,
          this.height + 8,
          6,
        )
      : ctx.rect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
    ctx.fill();
    ctx.stroke();

    if (this.loaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.fillStyle = "#ffea00";
    ctx.textAlign = "center";
    const label =
      this.weaponKey === "shotgun"
        ? "SPREAD"
        : this.weaponKey === "rifle"
          ? "RIFLE"
          : "SUB";
    ctx.fillText(label, this.x + this.width / 2, this.y - 8);

    ctx.restore();
  }
}
