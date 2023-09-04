class Cell {
  constructor(x, y, tile) {
    this.x = x;
    this.y = y;
    this.cX = x + (cellGab / 2);
    this.cY = y + (cellGab / 2);
    this.gabarit = cellGab;
    this.tile = tile;
    this.groop = null;
  }

  draw() {
    this.tile && this.tile.draw();
  }
}
