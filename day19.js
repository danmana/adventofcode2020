const fs = require('fs');

function toRegex(rules, i, part2) {
  let regex = '';
  let rule = rules[i];

  if (part2) {
    // 8: 42 | 42 8
    // matches 42, 42 42, 42 42 42 ... so its 42+
    if (i === 8) {
      return '(' + toRegex(rules, 42, true) + ')+';
    }
    // 11: 42 31 | 42 11 31
    // matches: 42 31, 42 42 31 31, 42 42 42 31 31 31
    // not really possible in js regex to match the exact number of times ...
    // using just + doesn't work ....
    // but it turns out that only rule 0 uses rule 11, so we can hack it
    // 0: 8 11
    // use a count {x} and replace x with 1,2,3... until we have no matches
    // not the pretiest solution, but it should work
    if (i === 11) {
      return '(' + toRegex(rules, 42, true) + '){x}(' + toRegex(rules, 31, true) + '){x}';
    }
  }



  for (let option of rule) {
    regex += '|';
    for (let op of option) {
      if (typeof op === 'number') {
        regex += toRegex(rules, op, part2);
      } else {
        regex += op;
      }
    }
  }
  regex = regex.slice(1); // there is an extra | at the beginning
  if (regex.includes('|')) {
    regex = '(' + regex + ')';
  }
  if (i === 0) {
    regex = '^' + regex + '$';
  }
  return regex;
}

fs.readFile('./input/input19.txt', 'utf8', (err, data) => {
  const [rulePart, linesPart] = data.trim().split('\n\n');
  const ruleLines = rulePart.split('\n');
  const lines = linesPart.split('\n');
  const rules = [];

  for (let line of ruleLines) {
    const [index, ruleText] = line.split(': ');
    const ruleOptions = ruleText.split(' | ')
      .map(option => option.split(' ')
        .map(op => {
          return op.startsWith('"') ? op[1] : Number(op);
        })
      );
    rules[Number(index)] = ruleOptions;
  }

  let regex = RegExp(toRegex(rules, 0));

  let result1 = 0;
  for (let line of lines) {
    if (regex.test(line)) {
      result1++;
    }
  }
  console.log('Result 1: ', result1);

  let result2 = 0;
  for (let line of lines) {
    for (let x = 1; x < 10; x++) { // 10 should be more than enough based on the lengths of the strings
      let regex2 = RegExp(toRegex(rules, 0, true).replace(/x/g, x));
      if (regex2.test(line)) {
        result2++;
        break;
      }
    }
  }
  console.log('Result 2: ', result2);

});