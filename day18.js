const fs = require('fs');

// top down recursive descent parser
class Parser {

  get lookahead() {
    return this.chars[0];
  }

  get stop() {
    return this.chars.length === 0;
  }

  constructor(line, part1) {
    this.chars = line.replace(/ /g, '').split('');
    this.part1 = part1;
  }

  parse() {
    return this.expr();
  }

  expr() {
    let x = this.term();
    return this.exprTail(x);
  }

  term() {
    let x = this.factor();
    return this.termTail(x);
  }

  termTail(x) {
    if (this.stop || this.lookahead === ')') {
      return x;
    }
    if (this.part1) {
      if (this.lookahead === '*' || this.lookahead === '+') {
        return x;
      }
    } else {
      if (this.lookahead === '+') {
        this.match('+');
        let y = this.factor();
        return this.termTail(x + y);
      }
      if (this.lookahead === '*') {
        return x;
      }
    }
    throw new Error();
  }

  factor() {
    if (this.lookahead === '(') {
      this.match('(');
      let x = this.expr();
      this.match(')');
      return x;
    }
    if (/\d/.test(this.lookahead)) {
      let x = Number(this.lookahead);
      this.match(this.lookahead);
      return x;
    }

    throw new Error();
  }

  exprTail(x) {
    if (this.stop || this.lookahead === ')') {
      return x;
    }
    if (this.part1) {
      if (this.lookahead === '+') {
        this.match('+');
        let y = this.term();
        return this.exprTail(x + y);
      }
    }
    if (this.lookahead === '*') {
      this.match('*');
      let y = this.term();
      return this.exprTail(x * y);
    }
    throw new Error();
  }

  match(ch) {
    if (this.lookahead === ch) {
      this.chars.shift();
    } else {
      throw new Error();
    }
  }
}




fs.readFile('./input/input18.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  // This first part was ok, my first attempt with a bottom-up parser worked
  // but it was flawed, and could not be extended to the seconds part
  // I had to rewrite the whole thing as a top-down recursive descent parser

  console.log('Examples part 1:');
  console.log(new Parser('1 + (2 * 3) + (4 * (5 + 6))', true).parse());
  console.log(new Parser('2 * 3 + (4 * 5)', true).parse());
  console.log(new Parser('5 + (8 * 3 + 9 + 3 * 4 * 3)', true).parse());
  console.log(new Parser('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', true).parse());
  console.log(new Parser('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', true).parse());

  let result1 = 0;
  for (let line of lines) {
    result1 += new Parser(line, true).parse();
  }
  console.log('Result 1: ', result1);

  console.log('Examples part 2:');
  console.log(new Parser('1 + (2 * 3) + (4 * (5 + 6))', false).parse());
  console.log(new Parser('2 * 3 + (4 * 5)', false).parse());
  console.log(new Parser('5 + (8 * 3 + 9 + 3 * 4 * 3)', false).parse());
  console.log(new Parser('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', false).parse());
  console.log(new Parser('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', false).parse());

  let result2 = 0;
  for (let line of lines) {
    result2 += new Parser(line, false).parse();
  }
  console.log('Result 2: ', result2);




});