function getRandomRgb() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `${r},${g},${b}`;
}

export const createRandomBoard = (height, width) => {
  const board = [];

  for (var i = 0; i < width; i++) {
    board.push([]);
    for (var j = 0; j < height; j++) {
      if (Math.random() >= 0.5) {
        board[i].push({
          y: i,
          x: j,
          color: getRandomRgb(),
          age: 1,
          alive: true
        });
      } else {
        board[i].push({ y: i, x: j, color: "", age: 0, alive: false });
      }
    }
  }
  return board;
};

export const initBoard = (height, width) => {
  const h = height;
  const w = width;
  const initBoard = [];
  for (var i = 0; i < w; i++) {
    initBoard.push([]);
    for (var j = 0; j < h; j++) {
      initBoard[i].push({ y: i, x: j, color: "", age: 0, alive: false });
    }
  }
  return initBoard;
};

export const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
};

export const rgbToHex = (red, green, blue) => {
  var rgb = blue | (green << 8) | (red << 16);
  return "#" + (0x1000000 + rgb).toString(16).slice(1);
};
