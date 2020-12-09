const fs = require('fs');

function restrict(range, firstHalf) {
  const [start, end] = range;
  const mid = (start + end + 1) / 2;
  return firstHalf ? [start, mid - 1] : [mid, end];
}

function getPos(line) {
  let rowPos = [0, 127];
  let colPos = [0, 7];
  for (let ch of line) {
    if (ch === 'F') {
      rowPos = restrict(rowPos, true);
    } else if (ch === 'B') {
      rowPos = restrict(rowPos, false);
    } else if (ch === 'L') {
      colPos = restrict(colPos, true);
    } else if (ch === 'R') {
      colPos = restrict(colPos, false);
    }
  }
  return {
    row: rowPos[0],
    col: colPos[0]
  }
}

fs.readFile('./input/input05.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  let result1 = 0;
  let ids = [];
  for (let line of lines) {
    let { row, col } = getPos(line);
    const id = row * 8 + col;
    ids.push(id);
    if (id > result1) {
      result1 = id;
    }
  }

  console.log('Result 1: ', result1);

  ids.sort();
  let result2 = 0;
  for (let i = 0; i < ids.length - 1; i++) {
    if (ids[i] + 1 !== ids[i + 1]) {
      result2 = ids[i] + 1;
      break;
    }
  }

  console.log('Result 2: ', result2);


});