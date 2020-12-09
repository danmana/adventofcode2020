const fs = require('fs');
function hasAllKeys(passport, mandatory) {
  for (let key of mandatory) {
    if (!passport.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
function isValid(passport) {
  return /^(19[2-9][0-9])|(200[012])$/.test(passport.byr) &&
    /^201[0-9]|2020$/.test(passport.iyr) &&
    /^202[0-9]|2030$/.test(passport.eyr) &&
    /^(1[5-8][0-9]cm)|(19[0-3]cm)|(59in)|(6[0-9]in)|(7[0-6]in)$/.test(passport.hgt) &&
    /^#[0-9a-f]{6}$/.test(passport.hcl) &&
    /^amb|blu|brn|gry|grn|hzl|oth$/.test(passport.ecl) &&
    /^[0-9]{9}$/.test(passport.pid);
}

fs.readFile('./input/input04.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');
  const passports = [];
  let passport = {};
  for (let line of lines) {
    if (line.length === 0) {
      // end of passport
      passports.push(passport);
      passport = {};
      continue;
    }

    for (let keyVal of line.split(' ')) {
      let [key, val] = keyVal.split(':');
      passport[key] = val;
    }
  }
  passports.push(passport);



  const mandatory = [
    'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid',
  ];
  let result1 = 0;
  let result2 = 0;
  for (let passport of passports) {
    if (hasAllKeys(passport, mandatory)) {
      result1++;
      if (isValid(passport)) {
        result2++;
      }
    }
  }

  console.log('Result 1: ', result1);
  console.log('Result 2: ', result2);


});