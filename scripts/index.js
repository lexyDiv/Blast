const canvas = document.getElementById('canvas');
const { width } = canvas;
const { height } = canvas;
const ctx = canvas.getContext('2d');
const fieldHeight = 9;
const fieldWidth = 11;
const cellGab = 50;
const bolsImages = {
  green: new Image(),
  violet: new Image(),
  red: new Image(),
  blue: new Image(),
  bomb: new Image(),
};
bolsImages.green.src = './src/green.png';
bolsImages.blue.src = './src/blue.png';
bolsImages.red.src = './src/red.png';
bolsImages.violet.src = './src/violet.png';
bolsImages.bomb.src = './src/bomb.jpg';

const cursor = {
  x: 0,
  y: 0,
};

let groopColors = {
  blue: [],
  violet: [],
  green: [],
  red: [],
  bomb: [],
};

function getColor() {
  const colors = ['red', 'blue', 'violet', 'green'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getDistanse(finish, start, needAngle) {
  const a = finish.x - start.x;
  const b = finish.y - start.y;
  const c = Math.sqrt(a * a + b * b);
  if (!needAngle) {
    return c;
  }
  return { c, angle: Math.atan2(b, a) };
}

canvas.onmousemove = function (e) {
  const koofX = width / document.documentElement.clientWidth;
  const koofY = height / document.documentElement.clientHeight;
  cursor.x = e.pageX * koofX;
  cursor.y = e.pageY * koofY;
  room.getCell();
};

canvas.addEventListener('click', () => {
  !room.boo
    && room.focusCell
     && !room.tilesOnMix.length
      && room.destroy();
  cursor.click = true;
});
