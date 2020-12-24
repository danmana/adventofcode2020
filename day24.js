const fs = require('fs');

const reverseDir = {
  e: 'w',
  se: 'nw',
  sw: 'ne',
  w: 'e',
  nw: 'se',
  ne: 'sw',
}

function move(x, y, z, dir) {
  switch (dir) {
    case 'e': { x++; y--; } break;
    case 'w': { x--; y++; } break;
    case 'ne': { y--; z++; } break;
    case 'nw': { x--; z++; } break;
    case 'se': { x++; z--; } break;
    case 'sw': { y++; z--; } break;
  }
  return { x, y, z };
}

/**
 * 
 * @param {string[]} lines 
 */
function readLines(lines) {
  let tiles = {};

  for (let line of lines) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < line.length; i++) {
      let dir = line[i];
      if (dir === 's' || dir === 'n') {
        dir = dir + line[i + 1];
        i++;
      }

      let next = move(x, y, z, dir);
      x = next.x;
      y = next.y;
      z = next.z;
    }

    let key = `${x}, ${y}, ${z}`;
    let tile = tiles[key];
    if (tile) {
      tile.white = !tile.white;
      // console.log('flip', key, tile.white);
    } else {
      tile = {
        white: false,
        x, y, z
      };
      tiles[key] = tile;
      // console.log('first time', key, tile.whsite);
    }
  }
  return tiles;
}

function countBlackNeighbours(tiles, x, y, z) {
  let black = 0;
  for (let dir of ['e', 'w', 'ne', 'nw', 'se', 'sw']) {
    let next = move(x, y, z, dir);
    let key = `${next.x}, ${next.y}, ${next.z}`;
    let neighbour = tiles[key];
    if (neighbour && !neighbour.white) {
      black++;
    }
  }
  return black;
}

function conwayFlip(tiles) {
  let flip = {};
  for (let key in tiles) {
    let tile = tiles[key];
    let clone = Object.assign({}, tile);
    flip[key] = clone;
    let { x, y, z } = tile;
    let black = countBlackNeighbours(tiles, x, y, z);
    if (!tile.white && (black === 0 || black > 2)) {
      clone.white = true;
    } else if (tile.white && black === 2) {
      clone.white = false;
    }

    // we need to process white neighbours that are not in the current tile list
    for (let dir of ['e', 'w', 'ne', 'nw', 'se', 'sw']) {
      let next = move(x, y, z, dir);
      let key = `${next.x}, ${next.y}, ${next.z}`;
      let neighbour = tiles[key];
      if (!neighbour) {
        black = countBlackNeighbours(tiles, next.x, next.y, next.z);
        if (black === 2) {
          let newTile = {
            x: next.x,
            y: next.y,
            z: next.z,
            white: false
          };
          flip[key] = newTile;
        }
      }

    }
  }
  return flip;
}

fs.readFile('./input/input24.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  let tiles = readLines(lines);


  let result1 = Object.values(tiles).filter(t => !t.white).length;
  console.log('Result 1: ', result1);

  for (let i = 0; i < 100; i++) {
    tiles = conwayFlip(tiles);
  }

  let result2 = Object.values(tiles).filter(t => !t.white).length;
  console.log('Result 2: ', result2);

});