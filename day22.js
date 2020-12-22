const fs = require('fs');

/**
 * @param {number[]} cards1 
 * @param {number[]} cards2 
 */
function playCombat(cards1, cards2) {
  while (cards1.length && cards2.length) {
    let c1 = cards1.shift();
    let c2 = cards2.shift();
    if (c1 > c2) {
      cards1.push(c1);
      cards1.push(c2);
    } else {
      cards2.push(c2);
      cards2.push(c1);
    }
  }
  if (cards1.length) {
    return {
      winner: 1,
      cards: cards1
    };
  }
  return {
    winner: 2,
    cards: cards2
  }
}

/**
 * @param {number[]} cards1 
 * @param {number[]} cards2 
 * @param {Set<string>} seen 
 */
function playRecursiveCombat(cards1, cards2) {
  let seen = new Set();
  while (cards1.length && cards2.length) {
    // 1: was played before?
    let hand1 = '1:' + cards1.join(',');
    let hand2 = '2:' + cards2.join(',');
    if (seen.has(hand1) || seen.has(hand2)) {
      return {
        winner: 1,
        cards: cards1
      };
    }
    seen.add(hand1);
    seen.add(hand2);

    // 2: draw cards
    let c1 = cards1.shift();
    let c2 = cards2.shift();

    // 3: recurse
    let winner;
    if (cards1.length >= c1 && cards2.length >= c2) {
      let subcards1 = cards1.slice(0, c1);
      let subcards2 = cards2.slice(0, c2);
      winner = playRecursiveCombat(subcards1, subcards2).winner;
    } else {
      winner = c1 > c2 ? 1 : 2;
    }

    // 4: round winner
    if (winner === 1) {
      cards1.push(c1);
      cards1.push(c2);
    } else {
      cards2.push(c2);
      cards2.push(c1);
    }
  }
  if (cards1.length) {
    return {
      winner: 1,
      cards: cards1
    };
  }
  return {
    winner: 2,
    cards: cards2
  }
}

/**
 * 
 * @param {number[]} cards 
 */
function getScore(cards) {
  let score = 0;
  for (let i = 0; i < cards.length; i++) {
    score += (cards.length - i) * cards[i];
  }
  return score;
}

fs.readFile('./input/input22.txt', 'utf8', (err, data) => {
  const [p1Lines, p2Lines] = data.trim().split('\n\n');

  let cards1 = p1Lines.split('\n');
  cards1.shift();// remove the 'Player 1:' row
  cards1 = cards1.map(c => Number(c));

  let cards2 = p2Lines.split('\n');
  cards2.shift();// remove the 'Player 2:' row
  cards2 = cards2.map(c => Number(c));

  let game1 = playCombat(cards1.slice(), cards2.slice());
  let result1 = getScore(game1.cards);
  console.log('Result 1: ', result1);

  let game2 = playRecursiveCombat(cards1.slice(), cards2.slice());
  let result2 = getScore(game2.cards);
  console.log('Result 2: ', result2);

});