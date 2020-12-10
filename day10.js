const fs = require('fs');

function backtrackCount(n, numbers) {
  if (numbers.length === 0) {
    return 1;
  }
  const options = numbers.slice(0, 3).filter(x => x <= n + 3);
  let count = 0;
  for (let j = 0; j < options.length; j++) {
    count += backtrackCount(options[j], numbers.slice(j + 1));
  }
  return count;
}

function dynamicProgramming(numbers) {
  let count = [];
  for (let n of numbers) {
    count.push(0);
  }
  count[numbers.length - 1] = 1;
  for (let i = numbers.length - 2; i >= 0; i--) {
    for (let j = i + 1; j < numbers.length && numbers[j] - numbers[i] <= 3; j++) {
      count[i] += count[j];
    }
  }

  let total = 0;
  for (let i = 0; numbers[i] <= 3; i++) {
    total += count[i];
  }
  return total;
}


fs.readFile('./input/input10.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');
  const jolts = lines.map(n => Number(n));

  jolts.sort((a, b) => a - b);

  let count1 = 0;
  let count3 = 0;
  let lastJolt = 0;
  for (let jolt of jolts) {
    if (jolt - lastJolt === 1) {
      count1++;
    } else if (jolt - lastJolt === 3) {
      count3++;
    }
    lastJolt = jolt;
  }
  count3++;

  const result1 = count1 * count3;
  console.log(`Result 1: ${count1} * ${count3} = `, result1);

  // let result2 = backtrackCount(0, jolts); // TOO SLOW
  let result2 = dynamicProgramming(jolts);
  console.log('Result 2: ', result2);

});