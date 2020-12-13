const fs = require('fs');

fs.readFile('./input/input13.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');
  const start = Number(lines[0]);
  const busses = lines[1].split(',').filter(bus => bus !== 'x').map(bus => Number(bus));


  let firstBusTime;
  let firstBus;

  outer:
  for (let i = start; ; i++) {
    for (let bus of busses) {
      if (i % bus === 0) {
        firstBusTime = i;
        firstBus = bus;
        break outer;
      }
    }
  }

  const result1 = firstBus * (firstBusTime - start);
  console.log('Result 1: ', result1);

  const busIndexes = lines[1].split(',')
    .map((bus, i) => { return { bus: Number(bus), index: i } })
    .filter(bus => !isNaN(bus.bus))
    .map(bus => { return { bus: BigInt(bus.bus), index: BigInt(bus.index) } });


  let first = busIndexes.shift();
  let result2 = BigInt(first.bus);
  let mul = BigInt(first.bus);
  let next;

  let zero = BigInt(0);
  console.log(busIndexes.length + ' busses');;
  for (let bus of busIndexes) {
    console.log('Searching for bus', bus);
    for (let i = BigInt(0); ; i++) {
      next = result2 + i * mul;
      if ((next + bus.index) % bus.bus === zero) {
        break;
      }
    }
    result2 = next;
    mul *= bus.bus;
    console.log('Temp result', result2, mul);
  }

  console.log('Result 2: ', result2);



});