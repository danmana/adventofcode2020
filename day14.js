const fs = require('fs');

function applyMask(value, mask) {
  let chars = value.toString(2).split('');
  while (chars.length !== 36) {
    chars.unshift('0');
  }
  mask.split('').forEach((ch, i) => {
    if (ch !== 'X') {
      chars[i] = ch;
    }
  });
  return BigInt('0b' + chars.join(''));
}

function applyMask2(value, mask) {
  let chars = value.toString(2).split('');
  while (chars.length !== 36) {
    chars.unshift('0');
  }
  mask.split('').forEach((ch, i) => {
    if (ch !== '0') {
      chars[i] = ch;
    }
  });
  let values = [''];

  for (let ch of chars) {
    if (ch !== 'X') {
      values = values.map(val => val + ch);
    } else {
      let copy = values.slice();
      values = values.map(val => val + '0').concat(copy.map(val => val + '1'));
    }
  }
  values = values.map(val => BigInt('0b' + val));

  return values;
}



fs.readFile('./input/input14.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  let mem = [];

  for (let line of lines) {
    if (line.startsWith('mask')) {
      mask = line.substr(7);
    } else {
      let [_, addr, value] = line.match(/^mem\[(\d+)\] = (\d+)$/);
      addr = Number(addr);
      value = BigInt(value);
      value = applyMask(value, mask);
      mem[addr] = value;
    }
  }

  let sum = BigInt(0);
  for (let val of Object.values(mem)) {
    sum += val;
  }

  console.log('Result 1: ', sum);

  mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  mem = [];

  for (let line of lines) {
    if (line.startsWith('mask')) {
      mask = line.substr(7);
    } else {
      let [_, addr, value] = line.match(/^mem\[(\d+)\] = (\d+)$/);
      addr = BigInt(addr);
      value = BigInt(value);
      let addresses = applyMask2(addr, mask);
      for (let address of addresses) {
        mem[Number(address)] = value;
      }
    }
  }

  sum = BigInt(0);
  for (let val of Object.values(mem)) {
    sum += val;
  }

  console.log('Result 2: ', sum);

});