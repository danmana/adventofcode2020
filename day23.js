function find(ring, label) {
  let current = ring;
  do {
    if (current.label === label) {
      return current;
    }
    current = current.next;
  } while (current !== ring);
  return null;
}

function ringToMap(ring) {
  let map = {};
  let current = ring;
  do {
    map[current.label] = current;
    current = current.next;
  } while (current !== ring);
  return map;
}

function play(ring, size = 9, moves = 100) {
  let current = ring;
  let cups = ringToMap(ring);

  for (let i = 0; i < moves; i++) {
    if ((10000 * i / moves) % 100 === 0) {
      console.log('Progress ' + (100 * i / moves) + '%');
    }

    // take next 3 cups
    let take = [current.next, current.next.next, current.next.next.next];
    let takeLabels = take.map(t => t.label);
    current.next = take[2].next;
    current.next.prev = current;

    // choose dest
    let cupLabel = current.label;
    let destLabel = 1 + (size + cupLabel - 2) % size;
    while (takeLabels.includes(destLabel)) {
      destLabel = 1 + (size + destLabel - 2) % size;
    }
    let dest = cups[destLabel];

    // place cups
    take[2].next = dest.next;
    dest.next.prev = take[2];
    dest.next = take[0];
    take[0].prev = dest;

    // choose next current cup
    current = current.next;
  }

  return cups[1];
}

function toString(ring) {
  let s = [];
  let current = ring;
  do {
    s.push(current.label);
    current = current.next;
  } while (current !== ring);
  return s.join('');
}

function toRing(input, size) {
  input = input.split('').map(x => Number(x));
  let start;
  let current;
  for (let label of input) {
    if (!start) {
      start = current = {
        label
      };
    } else {
      current.next = {
        label,
        prev: current
      };
      current = current.next;
    }
  }
  for (let i = input.length + 1; i <= size; i++) {
    current.next = {
      label: i,
      prev: current
    };
    current = current.next;
  }
  // complete the ring
  current.next = start;
  start.prev = current;
  return start;
}

// const input = '389125467'; // example
const input = '364289715'; // my input


const ring1 = toRing(input);
play(ring1);
let one = find(ring1, 1);

let result1 = toString(one).substr(1);
console.log('Result 1: ', result1);

const ring2 = toRing(input, 1000000); // my input
play(ring2, 1000000, 10000000);
one = find(ring2, 1);

let result2 = one.next.label * one.next.next.label;
console.log(`Result 2: ${one.next.label} * ${one.next.next.label} = `, result2);
