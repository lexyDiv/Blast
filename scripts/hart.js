let room = new Room(75, 75);
const buttonMix = new Mix(room.x, 22, 100, 30, 'mix');

function start() {
  room = new Room(75, 75);
  room.fieldCreate();
  room.grooping();
}

start();

document.addEventListener('keydown', (e) => {
  const key = e.code;
  if (key === 'Enter') {
    start();
  }
});

setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  room.boosesLife();
  room.tilesOnMixMove();
  room.columnsComplite();
  room.newTilesMove();
  buttonMix.check();
  room.draw();
  room.piecesDraw();
  room.piecesMove();
  cursor.click = false;
}, 30);
