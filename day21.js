const fs = require('fs');

fs.readFile('./input/input21.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  const ingredients = new Set();
  const alergens = new Set();
  const ingToAlg = {};
  const algToIng = {};

  const foods = [];

  for (let line of lines) {
    let [_, ingPart, algPart] = line.match(/^(.*) \(contains (.*)\)$/);
    let food = {
      ing: ingPart.split(' '),
      alg: algPart.split(', ')
    };
    foods.push(food);
    for (let ing of food.ing) {
      ingredients.add(ing);
      ingToAlg[ing] = new Set();
    }
    for (let alg of food.alg) {
      alergens.add(alg);
      algToIng[alg] = new Set();
    }
    for (let ing of food.ing) {
      for (let alg of food.alg) {
        ingToAlg[ing].add(alg);
        algToIng[alg].add(ing);
      }
    }
  }


  function intersect(set1, set2) {
    let ret = new Set();
    for (let x of set1) {
      if (set2.has(x)) {
        ret.add(x);
      }
    }
    return ret;
  }

  // map of <alg, Set<ing>> - for each alg which are the potential ingredients containing it
  let algMap = {};

  for (let food of foods) {
    for (let alg of food.alg) {
      if (!algMap[alg]) {
        algMap[alg] = new Set(food.ing);
      } else {
        algMap[alg] = intersect(algMap[alg], new Set(food.ing));
      }
    }
  }

  let ingWithAlergens = new Set();
  for (let ingSet of Object.values(algMap)) {
    for (let ing of ingSet) {
      ingWithAlergens.add(ing);
    }
  }

  let result1 = 0;
  for (let food of foods) {
    result1 += food.ing.filter(ing => !ingWithAlergens.has(ing)).length;
  }

  console.log('Result 1: ', result1);


  let knownAlergens = {};
  do {
    for (let alg in algMap) {
      if (algMap[alg].size === 0) {
        delete algMap[alg];
      } else if (algMap[alg].size === 1) {
        knownAlergens[alg] = algMap[alg].values().next().value;
        delete algMap[alg];
      } else {
        for (let known of Object.values(knownAlergens)) {
          algMap[alg].delete(known);
        }
      }
    }
  } while (Object.keys(algMap).length);

  console.log('Known Alergens:');
  console.log(knownAlergens);

  let result2 = Object.entries(knownAlergens)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([alg, ing]) => ing)
    .join(',');

  console.log('Result 2: ', result2);

});