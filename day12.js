const fs = require('fs');

function applyMove(ship, moveToMake) {
  let { move, n } = moveToMake;
  if (move === 'N') {
    ship.y -= n;
  } else if (move === 'E') {
    ship.x += n;
  } else if (move === 'S') {
    ship.y += n;
  } else if (move === 'W') {
    ship.x -= n;
  } else if (move === 'R') {
    ship.dir = (360 + ship.dir - n) % 360;
  } else if (move === 'L') {
    ship.dir = (ship.dir + n) % 360;
  } else if (move === 'F') {
    if (ship.dir === 0) {
      ship.x += n;
    } else if (ship.dir === 90) {
      ship.y -= n;
    } else if (ship.dir === 180) {
      ship.x -= n;
    } else if (ship.dir === 270) {
      ship.y += n;
    }
  }
}

function rot(pos, n) {
  while (n !== 0) {
    let aux = pos.y;
    pos.y = -pos.x;
    pos.x = aux;
    n -= 90;
  }
}

function applyMove2(ship, waypoint, moveToMake) {
  let { move, n } = moveToMake;

  if (move === 'N') {
    waypoint.y -= n;
  } else if (move === 'E') {
    waypoint.x += n;
  } else if (move === 'S') {
    waypoint.y += n;
  } else if (move === 'W') {
    waypoint.x -= n;
  } else if (move === 'R') {
    rot(waypoint, (360 - n));
  } else if (move === 'L') {
    rot(waypoint, n);
  } else if (move === 'F') {
    ship.x += n * waypoint.x;
    ship.y += n * waypoint.y;
  }
}


fs.readFile('./input/input12.txt', 'utf8', (err, data) => {
  const moves = data.trim().split('\n').map(line => {
    let [_, m, n] = line.match(/^(\w)(\d+)$/);
    return {
      move: m,
      n: Number(n)
    }
  });

  let ship = { x: 0, y: 0, dir: 0 };

  for (let move of moves) {
    applyMove(ship, move);
  }

  const result1 = Math.abs(ship.x) + Math.abs(ship.y);
  console.log('Result 1: ', result1);

  ship = { x: 0, y: 0 };
  let waypoint = { x: 10, y: -1 };
  for (let move of moves) {
    applyMove2(ship, waypoint, move);
  }

  const result2 = Math.abs(ship.x) + Math.abs(ship.y);
  console.log('Result 2: ', result2);




});