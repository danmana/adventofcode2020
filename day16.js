const fs = require('fs');

function isAnyRuleValid(rules, n) {
  for (let ranges of Object.values(rules)) {
    for (let range of ranges) {
      let { min, max } = range;
      if (n >= min && n <= max) {
        return true;
      }
    }
  }
  return false;
}

function getInvalidRules(rules, n) {
  let invalid = [];
  for (let rulename in rules) {
    let ranges = rules[rulename];
    let anyValid = false;
    for (let range of ranges) {
      let { min, max } = range;
      if (n >= min && n <= max) {
        anyValid = true;
      }
    }
    if (!anyValid) {
      invalid.push(rulename);
    }
  }
  return invalid;
}

fs.readFile('./input/input16.txt', 'utf8', (err, data) => {
  const [rulepart, mypart, otherparts] = data.trim().split('\n\n');
  const rulelines = rulepart.split('\n');
  const myline = mypart.split('\n')[1].split(',').map(n => Number(n));
  const otherlines = otherparts.split('\n')
    .filter(line => line !== 'nearby tickets:')
    .map(line => line.split(',').map(n => Number(n)));


  const rules = {};
  for (let line of rulelines) {
    let [name, constraints] = line.split(': ');
    constraints = constraints.split(' or ').map(c => {
      let [min, max] = c.split('-');
      return {
        min: Number(min),
        max: Number(max),
      }
    });
    rules[name] = constraints;
  }

  let invalidSum = 0;
  let validtickets = [];
  for (let line of otherlines) {
    let allFieldsValid = true;
    for (let val of line) {
      if (!isAnyRuleValid(rules, val)) {
        invalidSum += val;
        allFieldsValid = false;
      }
    }
    if (allFieldsValid) {
      validtickets.push(line);
    }
  }

  console.log('Result 1: ', invalidSum);


  let fields = [];
  for (let rulename in rules) {
    fields.push(Object.keys(rules).slice()); // at the beginning all fields are possible on every location
  }

  for (let ticket of validtickets) {
    for (let i = 0; i < ticket.length; i++) {
      let val = ticket[i];
      const invalid = getInvalidRules(rules, val);
      fields[i] = fields[i].filter(f => !invalid.includes(f));
    }
  }


  let changes = false;
  do {
    changes = false;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].length === 1) {
        let fixedField = fields[i][0];
        for (let j = 0; j < fields.length; j++) {
          if (i !== j && fields[j].includes(fixedField)) {
            fields[j] = fields[j].filter(f => f !== fixedField);
            changes = true;
          }
        }
      }
    }
  } while (changes);


  let result2 = 1;
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i][0]; // should be only one left for each index
    if (field.startsWith('departure')) {
      result2 *= myline[i];
    }
  }

  console.log('Result 2: ', result2);


});