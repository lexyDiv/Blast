class Tile {
  constructor(cell, x, y, color) {
    this.cell = cell;
    this.y = y;
    this.x = x;
    this.gabarit = cellGab;
    this.color = color;
    this.groop;
    this.gabarit = cellGab;
    this.image = bolsImages[this.color];
    this.angle = Math.random() + Math.floor(Math.random() * 2);
    this.spine = Math.floor(Math.random() * 2);
    Math.floor(Math.random() * 2)
      ? this.gabMore = { index: Math.floor(Math.random() * 5), step: 0.1, max: 5 }
      : this.gabMore = { index: -Math.floor(Math.random() * 5), step: -0.1, max: 5 };
    if (bolsImages[this.color]) {
      this.spriteXA = 150;
      this.spriteXB = 600;
    }
  }

  draw = () => {
    if (!room.stopGame) {
      this.spine ? this.angle += 0.01 : this.angle -= 0.01;
      Math.abs(this.gabMore.index) >= this.gabMore.max
        ? this.gabMore.step = -this.gabMore.step
        : false;
    }
    this.gabMore.index += this.gabMore.step;
    const cX = this.x + cellGab / 2;
    const cY = this.y + cellGab / 2;
    let gabX = this.gabarit + this.gabMore.index;
    let gabY = this.gabarit - this.gabMore.index;
    const drawX = -gabX / 2;
    const drawY = -gabY / 2;
    if (this.gabarit < cellGab) {
      gabX = this.gabarit;
      gabY = this.gabarit;
    }
    ctx.save();
    ctx.translate(cX, cY);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.spriteXA, 0, this.spriteXB, 600, drawX, drawY, gabX, gabY);
    ctx.restore();
  };
}
