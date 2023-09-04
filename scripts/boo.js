class Boo {
  constructor(x, y, tile) {
    this.x = x;
    this.y = y;
    this.tile = tile;
    this.color = tile.color;
    this.pieces = [];
  }

  piecesInit() {
    room && room.compliteCase[this.tile.color] && room.compliteCase[this.tile.color].real++;
    if (this.tile.color === 'bomb') {
      this.color = 'black';
      this.tile.color = this.color;
      room.bombs--;
    }
    for (let i = 0; i < 10; i++) {
      this.pieces.push({
        x: this.x + (cellGab / 2),
        y: this.y + (cellGab / 2),
        angle: Math.floor(Math.random() * 360),
        speed: Math.floor(Math.random() * 20) + 10,
        gabarit: Math.floor(Math.random() * 5) + 10,
        color: this.color,
      });
    }
  }
}
