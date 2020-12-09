const fs = require('fs');

function countLetters(str) {
  const count = {};
  for (let ch of str) {
    count[ch] = (count[ch] || 0) + 1;
  }
  return count;
}

fs.readFile('./input/input02.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  let countValid = 0;
  let countValid2 = 0;

  for (let line of lines) {
    let [_, min, max, letter, password] = line.match(/^(\d+)-(\d+) ([a-z]): (.*)$/);
    min = Number(min);
    max = Number(max);
    const count = countLetters(password);
    if (count[letter] >= min && count[letter] <= max) {
      countValid++;
    }

    const ch1 = password[min - 1];
    const ch2 = password[max - 1];
    // xor
    if (ch1 === letter ^ ch2 === letter) {
      countValid2++;
    }
  }

  console.log('Result 1: ', countValid);
  console.log('Result 2: ', countValid2);



});