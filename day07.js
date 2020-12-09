const fs = require('fs');

function getOrAddVertexIndex(vertices, name) {
  let index = vertices.indexOf(name);
  if (index === -1) {
    // new node
    vertices.push(name);
    index = vertices.length - 1;
  }
  return index;
}

fs.readFile('./input/input07.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');

  const vertices = [];
  const edges = [];

  for (let line of lines) {
    let [fromBag, toBags] = line.replace(/ bags?/g, '').replace('.', '').split(' contain ');

    let fromIndex = getOrAddVertexIndex(vertices, fromBag);
    if (toBags === 'no other') {
      continue;
    }

    toBags = toBags.split(', ');
    for (let toBagVal of toBags) {
      let [_, w, toBag] = toBagVal.match(/^(\d+) (.*)$/);
      w = Number(w);
      let toIndex = getOrAddVertexIndex(vertices, toBag);
      edges.push({ u: fromIndex, v: toIndex, w: w });
    }

  }


  // Floyd-Warshall https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
  const dist = [];
  for (let i = 0; i < vertices.length; i++) {
    dist[i] = [];
    for (let j = 0; j < vertices.length; j++) {
      dist[i][j] = Number.POSITIVE_INFINITY;
    }
  }
  for (let edge of edges) {
    let { u, v, w } = edge;
    dist[u][v] = w;
  }
  for (let v = 0; v < vertices.length; v++) {
    dist[v][v] = 0;
  }
  for (let k = 0; k < vertices.length; k++) {
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < vertices.length; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }


  const myBagIndex = vertices.indexOf('shiny gold');
  let result1 = 0;
  for (let i=0;i<vertices.length;i++) {
    let w = dist[i][myBagIndex];
    if (w !== 0 && w < Number.POSITIVE_INFINITY) {
      result1++;
    }
  }

  console.log('Result 1: ', result1);

  // there probably is a better alg than this recursive one...
  function countBags(edges, from) {
    const toEdges = edges.filter(edge => edge.u === from);
    let count = 1;
    for (let edge of toEdges) {
      count += edge.w * countBags(edges, edge.v);
    }
    return count;
  }

  let result2 = countBags(edges, myBagIndex) - 1;

  console.log('Result 2: ', result2);
});