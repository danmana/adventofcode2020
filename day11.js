const fs = require('fs');

function getNeighbours(map, i, j) {
  const neighbours = [];
  for (let [di, dj] of [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]) {
    const nI = i + di;
    const nJ = j + dj;
    if (nI < 0 || nJ < 0) {
      continue;
    }
    if (nI >= map.length || nJ >= map[nI].length) {
      continue;
    }
    neighbours.push(map[nI][nJ]);
  }
  return neighbours;
}

function getNeighbours2(map, i, j) {
  const neighbours = [];
  outer:
  for (let [di, dj] of [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]) {
    for (let r = 1; ;r++ ) {
      const nI = i + di * r;
      const nJ = j + dj * r;
      if (nI < 0 || nJ < 0) {
        continue outer;
      }
      if (nI >= map.length || nJ >= map[nI].length) {
        continue outer;
      }
      if (map[nI][nJ] !== '.') {
        neighbours.push(map[nI][nJ]);
        continue outer;
      }

    }
  }
  return neighbours;
}

// like Conways game of life
function next(map, ngbFn, tolerance) {
  const nextMap = [];
  for (let i = 0; i < map.length; i++) {
    const line = map[i];
    nextMap[i] = [];
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      nextMap[i][j] = ch;
      if (ch === 'L') {
        const ngb = ngbFn(map, i, j);
        if (!ngb.includes('#')) {
          nextMap[i][j] = '#';
        }
      } else if (ch === '#') {
        const ngb = ngbFn(map, i, j);
        if (ngb.filter(x => x === '#').length >= tolerance) {
          nextMap[i][j] = 'L';
        }
      }
    }
  }
  return nextMap;
}
function eq(map1, map2) {
  for (let i = 0; i < map1.length; i++) {
    for (let j = 0; j < map1[i].length; j++) {
      if (map1[i][j] !== map2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function play(map, ngbFn, tolerance) {
  let changes = true;
  do {
    let nextMap = next(map, ngbFn, tolerance);
    changes = !eq(map, nextMap);
    map = nextMap;
  } while(changes);
  return map;
}

fs.readFile('./input/input11.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n').map(line => line.split(''));

  let map1 = play(lines, getNeighbours, 4);
  let chars1 = map1.map(l => l.join('')).join('').split('');
  let occupied1 = chars1.filter(ch => ch === '#').length;

  console.log('Result 1: ', occupied1);

  let map2 = play(lines, getNeighbours2, 5);
  let chars2 = map2.map(l => l.join('')).join('').split('');
  let occupied2 = chars2.filter(ch => ch === '#').length;
  console.log('Result 2: ', occupied2);

});