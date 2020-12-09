const fs = require('fs');

function eval(ops) {
  let acc = 0;
  let opIndex = 0;

  let visited = new Set();

  while (!visited.has(opIndex) && opIndex < ops.length) {
    visited.add(opIndex);
    let { op, val } = ops[opIndex];
    if (op === 'acc') {
      acc += val;
      opIndex++;
    } else if (op === 'jmp') {
      opIndex += val;
    } else {
      opIndex++;
    }
  }

  let finished = opIndex >= ops.length;
  return {
    finished,
    acc
  }
}


fs.readFile('./input/input08.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  const ops = lines.map(line => {
    let [_, op, val] = line.match(/^(acc|jmp|nop) ([+-]\d+)$/)
    val = Number(val);
    return {
      op,
      val
    }
  });

  let res = eval(ops);

  console.log('Result 1: ', res.acc);

  for (let i = 0; i < ops.length; i++) {
    let op = ops[i];
    if (op.op === 'acc') {
      continue;
    }

    let fixed = ops.slice();
    if (op.op === 'jmp') {
      fixed[i] = {
        op: 'nop',
        val: op.val
      };
    } else {
      fixed[i] = {
        op: 'jmp',
        val: op.val
      };
    }
    res = eval(fixed);
    if (res.finished) {
      break;
    }

  }

  console.log('Result 2: ', res.acc);



});