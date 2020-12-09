const fs = require('fs');

function countTrees(map, moveX, moveY) {
  let i = 0;
  let j = 0;
  let count = 0;
  while (i < map.length) {
    const line = map[i];
    if (line[j]) {
      count++;
    }
    i += moveY;
    j = (j + moveX) % line.length;
  }
  return count;
}

fs.readFile('./input/input03.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');
  const map = lines.map(line => line.split('').map(ch => ch === '#'));

  const trees = countTrees(map, 3, 1);

  console.log('Result 1: ', trees);

  let result2 = trees;
  for (let move of [[1,1],[5,1],[7,1],[1,2]]) {
    result2 *= countTrees(map, move[0], move[1]);
  }

  console.log('Result 2: ', result2);

});