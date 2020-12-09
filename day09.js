const fs = require('fs');

function isSum(n, preamble) {
  for (let i = 0; i < preamble.length - 1; i++) {
    for (let j = i + 1; j < preamble.length; j++) {
      let a = preamble[i];
      let b = preamble[j];
      if (n === a + b) {
        return true;
      }
    }
  }
  return false;
}

function exploit(numbers, p) {
  numbers = numbers.slice();
  const preamble = numbers.splice(0, p);
  while (numbers.length) {
    let n = numbers.shift();
    if (!isSum(n, preamble)) {
      return n;
    }
    preamble.shift();
    preamble.push(n);
  }
  return -1;
}

function sumArray(arr) {
  let s = 0;
  for (let val of arr) {
    s += val;
  }
  return s;
}


fs.readFile('./input/input09.txt', 'utf8', (err, data) => {
  const numbers = data.trim().split('\n').map(n => Number(n));


  const result1 = exploit(numbers, 25);

  console.log('Result 1: ', result1);


  let result2 = 0;
  outer:
  for (let i = 0; i < numbers.length - 2; i++) {
    for (let j = i + 2; j < numbers.length; j++) {
      let weakness = numbers.slice(i, j);
      let sum = sumArray(weakness);

      if (sum > result1) {
        // no point in going further, already exceeded
        break;
      } else if (sum === result1) {
        let min = Math.min(...weakness);
        let max = Math.max(...weakness);
        result2 = min + max;
        break outer;
      }

    }
  }
  console.log('Result 2: ', result2);







});