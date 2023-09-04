class Room {
  constructor() {
    this.gabX = cellGab * fieldWidth;
    this.gabY = cellGab * fieldHeight;
    this.x = (width - this.gabX) / 2;
    this.y = (height - this.gabY) / 2;
    this.field = [];
    this.boo = false;
    this.booses = [];
    this.onDestroy = [];
    this.columnsOnComplite = [];
    this.newTiles = [];
    this.tilesOnMix = [];
    this.mixSteps = 0;
    this.clickedCell = null;
    this.destroyedTiles = 0;
    this.score = { need: 200000, real: 0 };
    this.playerSteps = 65;
    this.items = ['red', 'blue', 'violet', 'green'];
    this.bombs = 0;
    this.minGroop = 5;
    this.mixing = 4;
    this.stopGame = '';
    this.compliteCase = {
      red: { real: 0 },
      blue: { real: 0 },
      green: { real: 0 },
      violet: { real: 0 },
    };
  }

  order() {
    if (this.score.real >= this.score.need) {
      this.stopGame = 'you win';
    } else if (!this.playerSteps) {
      this.stopGame = 'game over';
    }
    let maxGroop = 0;
    for (const key in groopColors) {
      const max = groopColors[key].sort((a, b) => b.length - a.length)[0];
      max && maxGroop < max.length ? maxGroop = max.length : false;
    }
    if (!this.bombs && maxGroop < this.minGroop) {
      this.zugzwang = true;
    } else {
      this.zugzwang = false;
    }
    this.zugzwang && !this.mixing ? this.stopGame = 'game over' : false;
  }

  barDraw(color, i) {
    ctx.fillStyle = 'black';
    ctx.drawImage(bolsImages[color], 0, 0, 900, 600, this.x + 160 + (i * 70), this.y - 66, 20, 20);
    ctx.textAlign = 'center';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(` : ${this.compliteCase[color].real}`, this.x + 185 + (i * 70), this.y - 52);
    if (!i) {
      ctx.fillText(`mixing left : ${this.mixing}`, this.x + 175 + (i * 70), this.y - 22);
      ctx.fillText(`crash left : ${this.playerSteps}`, this.x + 275 + (i * 70), this.y - 22);
      if (this.alert) {
        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = 'yellow';
        ctx.fillText(`minimum to crash : ${this.minGroop}`, this.x + 275 + (i * 70), this.y + 230);
      } else {
        ctx.fillText(`minimum to crash : ${this.minGroop}`, this.x + 375 + (i * 70), this.y - 22);
      }

      if (this.stopGame) {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'grey';
        ctx.textAlign = 'center';
        ctx.font = 'bold 150px sans-serif';
        ctx.fillText(this.stopGame, this.x + 272, this.y + 250);
        ctx.strokeText(this.stopGame, this.x + 272, this.y + 250);
        ctx.font = 'bold 80px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('press ENTER to start', this.x + 272, this.y + 450);
      }
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = 'blue';
      ctx.fillText(`score : ${this.score.real} / ${this.score.need}`, this.x + 275 + (i * 70), this.y + this.gabY + 45);
      if(this.zugzwang) {
        ctx.fillStyle = 'yellow';
        ctx.fillText('zugzwang', this.x + 272, this.y + 230);
      }
    }
  }

  tilesOnMixMove() {
    if (this.mixSteps) {
      this.mixSteps--;
      if (this.mixSteps) {
        this.tilesOnMix.forEach((tile) => {
          tile.x += Math.cos(tile.mixAngle) * tile.mixSpeed;
          tile.y += Math.sin(tile.mixAngle) * tile.mixSpeed;
        });
      } else {
        this.tilesOnMix.forEach((tile) => {
          tile.x = tile.cell.x;
          tile.y = tile.cell.y;
          tile.cell.groop = null;
        });
        this.tilesOnMix.length = 0;
        this.grooping();
      }
    }
  }

  mix() {
    this.mixing--;
    this.mixSteps = 50;
    const cells = [];
    const tiles = [];
    this.field.forEach((column) => column.forEach((cell) => {
      cells.push(cell);
      tiles.push(cell.tile);
      this.tilesOnMix.push(cell.tile);
    }));
    for (let i = 0; i < cells.length; i++) {
      const ranCell = Math.floor(Math.random() * cells.length);
      const ranTile = Math.floor(Math.random() * tiles.length);
      const cell = cells[ranCell];
      const tile = tiles[ranTile];
      cell.tile = tile;
      tile.cell = cell;
      const { c, angle } = getDistanse({ x: cell.x, y: cell.y }, { x: tile.x, y: tile.y }, true);
      tile.mixSpeed = c / this.mixSteps;
      tile.mixAngle = angle;
      cells.splice(ranCell, 1);
      tiles.splice(ranTile, 1);
      i--;
    }
  }

  getScore(tiles) {
    for (let i = 0; i < tiles; i++) {
      this.score.real += 100;
      this.score.real += i * 100;
    }
  }

  newTilesMove() {
    if (this.boo) {
      if (this.destroyedTiles) {
        this.getScore(this.destroyedTiles);
        if (this.destroyedTiles >= 12 && !this.detanation) {
          this.clickedCell.tile.color = 'bomb';
          this.clickedCell.tile.image = bolsImages.bomb;
          this.bombs++;
        }
        this.destroyedTiles = 0;
        this.detanation = false;
      }
      for (let i = 0; i < this.newTiles.length; i++) {
        const tile = this.newTiles[i];
        tile.y += 5;
        tile.y + cellGab / 2 >= this.y && tile.gabarit < cellGab ? tile.gabarit += 5 : false;
        tile.gabarit > cellGab ? tile.gabarit = cellGab : false;
        if (tile.y >= tile.cell.y) {
          tile.y = tile.cell.y;
          this.newTiles.splice(i, 1);
          i--;
        }
      }
      if (!this.newTiles.length && !this.booses.length) {
        this.boo = false;
        this.grooping();
      }
    }
  }

  columnsComplite() {
    if (this.boo && !this.booses.length) {
      this.field.forEach((column) => column.forEach((cell) => cell.groop = null));
      this.columnsOnComplite.forEach((column) => {
        const tiles = [];
        column.forEach((cell) => {
          cell.tile && tiles.push(cell.tile);
        });
        const tilesNeeded = column.length - tiles.length;
        this.destroyedTiles += tilesNeeded;
        for (let i = 0; i < tilesNeeded; i++) {
          const tile = new Tile(null, column[0].x, (this.y - cellGab - (i * cellGab)), getColor());
          tile.gabarit = 0;
          tiles.unshift(tile);
        }
        tiles.forEach((tile, ind) => {
          tile.cell = column[ind];
          tile.cell.tile = tile;
        });
        this.newTiles = this.newTiles.concat(tiles);
      });
    }
  }

  piecesDraw() {
    this.onDestroy.forEach((piece) => {
      ctx.beginPath();
      ctx.strokeStyle = 'grey';
      ctx.fillStyle = piece.color;
      ctx.arc(piece.x, piece.y, piece.gabarit, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
  }

  boosesLife() {
    for (let i = 0; i < this.booses.length; i++) {
      const boo = this.booses[i];
      boo.distanse -= 7;
      if (boo.distanse <= 0) {
        this.onDestroy = this.onDestroy.concat(boo.pieces);
        boo.tile.cell.tile = null;
        this.booses.splice(i, 1);
        i--;
      }
    }
  }

  piecesMove() {
    for (let i = 0; i < this.onDestroy.length; i++) {
      const piece = this.onDestroy[i];
      piece.x += Math.cos(piece.angle) * piece.speed;
      piece.y += Math.sin(piece.angle) * piece.speed;
      if (
        piece.x < 0
                || piece.x > width
                || piece.y < 0
                || piece.y > height
      ) {
        this.onDestroy.splice(i, 1);
        i--;
      }
    }
  }

  bombEffect(bombCell) {
    bombCell.groop = bombCell.column.concat(bombCell.string);
    this.detanation = true;
  }

  booCreate(focusCell) {
    focusCell.groop.forEach((cell) => {
      const boo = new Boo(cell.x, cell.y, cell.tile);
      boo.piecesInit();
      boo.distanse = getDistanse({ x: cell.x, y: cell.y }, { x: focusCell.x, y: focusCell.y });
      this.booses.push(boo);
      this.columnsOnComplite.indexOf(cell.column) === -1 && this.columnsOnComplite.push(cell.column);
    });
  }

  destroy() {
    if (this.stopGame) { return; }
    if (this.focusCell.groop.length < this.minGroop && this.focusCell.tile.color !== 'bomb') {
      this.alert = true;
      return;
    }
    this.playerSteps--;
    this.alert = false;
    this.boo = true;
    this.clickedCell = this.focusCell;
    if (this.clickedCell.tile.color === 'bomb' && !this.clickedCell.tile.detonation) {
      this.clickedCell.groop = [];
      this.bombEffect(this.clickedCell);
    }
    this.booCreate(this.focusCell);
  }

  getCell() {
    const horisont = Math.floor((cursor.x - this.x) / cellGab);
    const vertikal = Math.floor((cursor.y - this.y) / cellGab);
    this.field[horisont] && this.field[horisont][vertikal]
      ? this.focusCell = this.field[horisont][vertikal]
      : this.focusCell = null;
  }

  more(cell) {
    if (!cell.groop) {
      groopColors[cell.tile.color].push([cell]);
      cell.groop = groopColors[cell.tile.color][groopColors[cell.tile.color].length - 1];
    }
    const vectors = {
      0: 'up',
      1: 'down',
      2: 'left',
      3: 'right',
    };
    for (let i = 0; i <= 3; i++) {
      const vector = vectors[i];
      if (cell[vector] && cell[vector].tile.color === cell.tile.color && !cell[vector].groop) {
        cell.groop.push(cell[vector]);
        cell[vector].groop = cell.groop;
        this.more(cell[vector]);
      }
    }
  }

  grooping() {
    groopColors = {
      blue: [],
      violet: [],
      green: [],
      red: [],
      bomb: [],
    };
    this.field.forEach((column) => column.forEach((cell) => {
      this.more(cell);
    }));
    room.order();
  }

  fieldCreate() {
    for (let x = 0; x < this.gabX; x += cellGab) {
      this.field.push([]);
      for (let y = 0; y < this.gabY; y += cellGab) {
        const cell = new Cell(x + this.x, y + this.y, null);
        const tile = new Tile(cell, x + this.x, y + this.y, getColor());
        cell.tile = tile;
        this.field[this.field.length - 1].push(cell);
      }
    }
    this.field.forEach((column, hor) => column.forEach((cell, ver) => {
      cell.up = this.field[hor][ver - 1];
      cell.down = this.field[hor][ver + 1];
      cell.left = this.field[hor - 1] && this.field[hor - 1][ver];
      cell.right = this.field[hor + 1] && this.field[hor + 1][ver];
      cell.column = column;
    }));
    for (let y = 0; y < this.field[0].length; y++) {
      const string = [];
      for (let x = 0; x < this.field.length; x++) {
        const cell = this.field[x][y];
        string.push(cell);
        cell.string = string;
      }
    }
  }

  draw = () => {
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(this.x, this.y, this.gabX, this.gabY);
    this.field.forEach((column) => column.forEach((cell) => cell.draw()));
    this.items.forEach((color, i) => this.barDraw(color, i));
  };
}
