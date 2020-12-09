const fs = require('fs');

fs.readFile('./input/input06.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  let groups = [];
  let group = {
    chars: {},
    count: 0
  };
  for (let line of lines) {
    if (line === '') {
      // group separator
      groups.push(group);
      group = {
        chars: {},
        count: 0
      };
      continue;
    }

    for (let ch of line) {
      group.chars[ch] = (group.chars[ch] || 0) + 1;
    }
    group.count++;
  }
  groups.push(group);

  let result1 = 0;
  let result2 = 0;
  for (let group of groups) {
    result1 += Object.keys(group.chars).length;
    result2 += Object.values(group.chars).filter(v => v === group.count).length;
  }
  console.log('Result 1: ', result1);
  console.log('Result 2: ', result2);

});