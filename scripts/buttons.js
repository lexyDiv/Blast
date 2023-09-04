// eslint-disable-next-line max-classes-per-file
class Button {
  constructor(x, y, gabX, gabY, text) {
    this.x = x;
    this.y = y;
    this.gabX = gabX;
    this.gabY = gabY;
    this.color = 'blue';
    this.text = text;
  }

  check() {
    if (!room.boo && !room.tilesOnMix.length && room.zugzwang && room.mixing) {
      if (
        !(
          cursor.x < this.x
                    || cursor.x > this.x + this.gabX
                    || cursor.y < this.y
                    || cursor.y > this.y + this.gabY
        )
      ) {
        this.color = 'red';
        if (cursor.click) {
          this.do();
        }
      } else {
        this.color = 'blue';
      }
      this.draw();
    }
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.gabX, this.gabY);
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px sans-serif';
    ctx.strokeText(this.text, this.x + 49, this.y + 25);
  }
}

class Mix extends Button {
  super() {}

  do() {
    room.mix();
  }
}
