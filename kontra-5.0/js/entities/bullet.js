// bullet.js - Entidad de Proyectiles y Disparos (Jugador y Enemigos)

class Bullet {
  constructor(
    x,
    y,
    vx,
    vy,
    isEnemy = false,
    damage = 1,
    color = "#ffea00",
    radius = 5,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isEnemy = isEnemy;
    this.damage = damage;
    this.color = color;
    this.radius = radius;
    this.toRemove = false;
    this.life = 120;

    // Sprite de disparo
    if (!Bullet.sprite) {
      Bullet.sprite = new Image();
      Bullet.spriteLoaded = false;
      Bullet.sprite.onload = () => {
        Bullet.spriteLoaded = true;
      };
      Bullet.sprite.src = "assets/img/disparo.png";
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) this.toRemove = true;
  }

  draw(ctx) {
    ctx.save();
    if (this.isEnemy) {
      ctx.fillStyle = this.color || "#ff1100";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffea00";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.55, 0, Math.PI * 2);
      ctx.fill();
    } else {
      if (Bullet.spriteLoaded) {
        const angle = Math.atan2(this.vy, this.vx);
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        const w = this.radius * 3.6;
        const h = this.radius * 2.2;
        ctx.drawImage(Bullet.sprite, -w / 2, -h / 2, w, h);
      } else {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
