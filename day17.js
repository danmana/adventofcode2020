const fs = require('fs');

const ACTIVE = '#';
const INACTIVE = '.';


function getNeighbours(cube, i, j, k) {
  let neighbours = [];
  for (let di of [-1, 0, 1]) {
    let slice = cube[i + di];
    for (let dj of [-1, 0, 1]) {
      let line = slice && slice[j + dj];
      for (let dk of [-1, 0, 1]) {
        if (di !== 0 || dj !== 0 || dk !== 0) { // all except center of the cube
          let ch = (line && line[k + dk]) || INACTIVE;
          neighbours.push(ch);
        }
      }
    }
  }
  return neighbours;
}

function getNeighbours4d(hypercube, h, i, j, k) {
  let neighbours = [];
  for (let dh of [-1, 0, 1]) {
    let cube = hypercube[h + dh];
    for (let di of [-1, 0, 1]) {
      let slice = cube && cube[i + di];
      for (let dj of [-1, 0, 1]) {
        let line = slice && slice[j + dj];
        for (let dk of [-1, 0, 1]) {
          if (dh !== 0 || di !== 0 || dj !== 0 || dk !== 0) { // all except center of the cube
            let ch = (line && line[k + dk]) || INACTIVE;
            neighbours.push(ch);
          }
        }
      }
    }
  }
  return neighbours;
}

function play(cube) {
  let nextCube = [];

  let dim1 = cube.length;
  let dim2 = cube[0].length;
  let dim3 = cube[0][0].length;
  for (let i = -1; i <= dim1; i++) {
    let nextSlice = [];
    let slice = cube[i];
    nextCube.push(nextSlice);
    for (let j = -1; j <= dim2; j++) {
      let nextLine = [];
      let line = slice && slice[j];
      nextSlice.push(nextLine);
      for (let k = -1; k <= dim3; k++) {
        let ch = (line && line[k]) || INACTIVE;
        let nextCh = INACTIVE;
        let neighbours = getNeighbours(cube, i, j, k);
        let active = neighbours.filter(n => n === ACTIVE).length;
        if (ch === ACTIVE && (active === 2 || active === 3)) {
          nextCh = ACTIVE;
        }
        if (ch === INACTIVE && active === 3) {
          nextCh = ACTIVE;
        }
        nextLine.push(nextCh);
      }
    }
  }
  return nextCube;
}


function play4d(hypercube) {
  let dim1 = hypercube.length;
  let dim2 = hypercube[0].length;
  let dim3 = hypercube[0][0].length;
  let dim4 = hypercube[0][0][0].length;

  let nextHypercube = [];
  for (let h = -1; h <= dim1; h++) {
    let nextCube = [];
    let cube = hypercube[h];
    nextHypercube.push(nextCube);

    for (let i = -1; i <= dim2; i++) {
      let nextSlice = [];
      let slice = cube && cube[i];
      nextCube.push(nextSlice);
      for (let j = -1; j <= dim3; j++) {
        let nextLine = [];
        let line = slice && slice[j];
        nextSlice.push(nextLine);
        for (let k = -1; k <= dim4; k++) {
          let ch = (line && line[k]) || INACTIVE;
          let nextCh = INACTIVE;
          let neighbours = getNeighbours4d(hypercube, h, i, j, k);
          let active = neighbours.filter(n => n === ACTIVE).length;
          if (ch === ACTIVE && (active === 2 || active === 3)) {
            nextCh = ACTIVE;
          }
          if (ch === INACTIVE && active === 3) {
            nextCh = ACTIVE;
          }
          nextLine.push(nextCh);
        }
      }
    }
  }

  return nextHypercube;
}

function logCube(cube) {
  let s = '';
  for (let slice of cube) {
    s += slice.map(line => line.join('')).join('\n');
    s += '\n---------------------------------------------\n';
  }
  s += '\n\n';
  console.log(s);
}

function countActive(cube) {
  let active = 0;
  for (let slice of cube) {
    for (let line of slice) {
      for (let ch of line) {
        if (ch === ACTIVE) {
          active++;
        }
      }
    }
  }
  return active;
}
function countActive4d(hypercube) {
  let active = 0;
  for (let cube of hypercube) {
    for (let slice of cube) {
      for (let line of slice) {
        for (let ch of line) {
          if (ch === ACTIVE) {
            active++;
          }
        }
      }
    }
  }
  return active;
}

fs.readFile('./input/input17.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  let cube = [lines.map(line => line.split(''))];

  let state = cube;
  // console.log('Start:');
  // logCube(state);

  for (let i = 0; i < 6; i++) {
    state = play(state);
    // console.log(`Step ${i}:`);
    // logCube(state);
  }

  let result1 = countActive(state);
  console.log('Result 1: ', result1);


  state = cube;
  for (let i = 0; i < 6; i++) {
    state = play4d(state);
  }


  let result2 = countActive4d(state);
  console.log('Result 2: ', result2);

});