const fs = require('fs');

fs.readFile('./input/input15.txt', 'utf8', (err, data) => {
  const numbers = data.trim().split(',').map(n => Number(n));
  // const numbers = [0, 3, 6];

  // first attempt was to keep adding to numbers array and use numbers.lastIndexOf,
  // this was too slow for part 2
  // second attempt used const lastIndexOf = {}; to keep track of the lastIndex in a cache
  // this worked better, but still took about 6min to find the solution 
  // after completing the challenge, I searched a bit online and found that using a Uint32Array as a cache would be faster
  // this last version works a lot faster: 1.5 sec vs 355 sec, cool :) I should remember this trick
  let lastIndexOf = new Uint32Array(0);
  const NOT_FOUND = 0xFFFFFFFF;

  function setLastIndexOf(n, index) {
    if (n >= lastIndexOf.length) {
      const old = lastIndexOf;
      lastIndexOf = new Uint32Array(2 * (n + 1)); // make it larger to avoid a lot of allocations
      lastIndexOf.set(old);
      lastIndexOf.fill(NOT_FOUND, old.length);
      delete old;
    }
    lastIndexOf[n] = index;
  }

  for (let i = 0; i < numbers.length - 1; i++) {
    let n = numbers[i];
    setLastIndexOf(n, i);
    // lastIndexOf[n] =i;
  }

  let numbersCount = numbers.length;
  let last = numbers[numbers.length - 1];

  while (numbersCount !== 2020) {
    let lastIndex = lastIndexOf[last];
    if (lastIndex === undefined || lastIndex === NOT_FOUND) {
      // lastIndexOf[last] = numbersCount - 1;
      setLastIndexOf(last, numbersCount - 1);
      last = 0;
    } else {
      let next = numbersCount - lastIndex - 1;
      // lastIndexOf[last] = numbersCount - 1;
      setLastIndexOf(last, numbersCount - 1);
      last = next;
    }

    numbersCount++;
  }

  const result1 = last;
  console.log('Result 1: ', result1);

  while (numbersCount !== 30000000) {
    if (numbersCount % 300000 === 0) {
      console.log('Progress ' + (numbersCount / 30000000 * 100).toFixed(2) + '%');
    }
    let lastIndex = lastIndexOf[last];
    if (lastIndex === undefined || lastIndex === NOT_FOUND) {
      // lastIndexOf[last] = numbersCount - 1;
      setLastIndexOf(last, numbersCount - 1);
      last = 0;
    } else {
      let next = numbersCount - lastIndex - 1;
      // lastIndexOf[last] = numbersCount - 1;
      setLastIndexOf(last, numbersCount - 1);
      last = next;
    }

    numbersCount++;
  }

  const result2 = last;
  console.log('Result 2: ', result2);
});