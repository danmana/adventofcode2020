const fs = require('fs');

fs.readFile('./input/input01.txt', 'utf8', (err, data) => {
  const numbers = data.trim().split('\n').map(line => Number(line));

  let result1 = 0;

  outer:
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      let a = numbers[i];
      let b = numbers[j];
      if (a + b === 2020) {
        result1 = a * b;
        break outer;
      }
    }
  }

  console.log('Result 1: ', result1);

  let result2 = 0;

  outer2:
  for (let i = 0; i < numbers.length - 2; i++) {
    for (let j = i + 1; j < numbers.length - 1; j++) {
      for (let k = j + 1; k < numbers.length; k++) {
        let a = numbers[i];
        let b = numbers[j];
        let c = numbers[k];
        if (a + b + c === 2020) {
          result2 = a * b * c;
          break outer2;
        }
      }
    }
  }


  console.log('Result 2: ', result2);

});