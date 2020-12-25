

function findLoopSize(pub, subj, m) {
  let val = 1;
  for (let i = 1; ; i++) {
    val = (val * subj) % m;
    if (val === pub) {
      return i;
    }
  }
}

function encode(val, size, m) {
  let ret = 1;
  for (let i = 0; i < size; i++) {
    ret = (ret * val) % m;
  }
  return ret;
}

let m = 20201227;
// my input
let publickey1 = 19241437;
let publickey2 = 17346587;

// example
// let publickey1 = 5764801;
// let publickey2 = 17807724;

// let loop1 = findLoopSize(publickey1, 7);
// let loop2 = findLoopSize(publickey2, 7);
let loop1, loop2;

let val = 1;
let subj = 7;
for (let i = 1; loop1 === undefined || loop2 === undefined; i++) {
  val = (val * subj) % m;
  if (val === publickey1) {
    loop1 = i;
  }
  if (val === publickey2) {
    loop2 = i;
  }
}

console.log('Loop 1:', loop1);
console.log('Loop 2:', loop2);

let result1 = encode(publickey1, loop2, m);
console.log('Result 1: ', result1);


let result2;
console.log('Result 2: ', result2);
