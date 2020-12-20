const fs = require('fs');

const monster =
  [
    '                  # '.split(''),
    '#    ##    ##    ###'.split(''),
    ' #  #  #  #  #  #   '.split('')
  ];


class Backtrack {
  constructor(tiles) {
    this.tiles = tiles;
    this.tileIds = tiles.map(t => t.id);
    this.tilesById = {};
    for (let t of tiles) {
      this.tilesById[t.id] = t;
    }
    this.imageSize = Math.sqrt(tiles.length);
    this.tileSize = tiles[0].image.length;
    this.used = new Set();
    this.solution = [];
    this.progress = [];
    for (let i = 0; i < this.imageSize; i++) {
      this.solution[i] = [];
      for (let j = 0; j < this.imageSize; j++) {
        this.solution[i][j] = null;
      }
    }
  }

  solve() {
    this.backtrack(0, -1);
    return this.solution;
  }

  loadSolution(sol) {
    sol = sol.split('\n').map(row => row.trim().split(' '));
    for (let i = 0; i < sol.length; i++) {
      for (let j = 0; j < sol[i].length; j++) {
        let [_, id, rot, flipY] = sol[i][j].match(/^(\d+)r(\d)(f?)$/);
        id = Number(id);
        rot = Number(rot);
        flipY = !!flipY;
        let tile = this.cloneTile(this.tilesById[id]);
        tile.rot = rot;
        tile.flipY = flipY;
        if (rot) {
          tile.image = this.rotate(tile.image, rot);
        }
        if (flipY) {
          this.flipY(tile.image);
        }

        this.solution[i][j] = tile;
      }
    }
  }

  getResult() {
    let sol = this.solution;
    console.log('Solution:');
    console.log(sol.map(row => row.map(x => x.id + 'r' + x.rot + (x.flipY ? 'f' : '')).join(' ')).join('\n'));
    console.log('Full image:');
    console.log(this.imgToString(this.getFullImage()));
    return sol[0][0].id * sol[0][this.imageSize - 1].id * sol[this.imageSize - 1][0].id * sol[this.imageSize - 1][this.imageSize - 1].id;
  }

  getResult2() {
    let cleanImage = this.getCleanImage();
    console.log('Clean image:');
    console.log(this.imgToString(this.getCleanImage()));
    let monsters = 0;
    for (let rot = 0; rot < 4; rot++) {
      for (let flipY of [false, true]) {
        let img = this.cloneImage(cleanImage);
        if (rot) {
          img = this.rotate(img, rot);
        }
        if (flipY) {
          this.flipY(img);
        }
        monsters += this.countMonsters(img);
      }
    }
    console.log('Monsters: ', monsters);

    let roughness = cleanImage.map(row => row.join('')).join('').split('').filter(x => x === '#').length;
    roughness -= monsters * monster.map(row => row.join('')).join('').split('').filter(x => x === '#').length;
    return roughness;
  }

  countMonsters(img) {
    let monsters = 0;
    for (let i = 0; i < img.length - monster.length; i++) {
      for (let j = 0; j < img[i].length; j++) {
        if (this.isMonster(img, i, j)) {
          monsters++;
        }
      }
    }
    return monsters;
  }

  isMonster(img, i, j) {
    for (let mi = 0; mi < monster.length; mi++) {
      for (let mj = 0; mj < monster[mi].length; mj++) {
        if (monster[mi][mj] === '#' && img[i + mi][j + mj] !== '#') {
          return false;
        }
      }
    }
    return true;
  }

  imgToString(img) {
    return img.map(row => row.join('')).join('\n');
  }

  getFullImage() {
    let img = [];
    for (let i = 0; i < this.imageSize * (this.tileSize + 1); i++) {
      img[i] = [];
      for (let j = 0; j < this.imageSize * (this.tileSize + 1); j++) {
        img[i][j] = ' ';
      }
    }

    for (let i = 0; i < this.imageSize; i++) {
      for (let j = 0; j < this.imageSize; j++) {
        let tile = this.solution[i][j];
        for (let ti = 0; ti < this.tileSize; ti++) {
          for (let tj = 0; tj < this.tileSize; tj++) {
            let imgi = i * (this.tileSize + 1) + ti;
            let imgj = j * (this.tileSize + 1) + tj;
            img[imgi][imgj] = tile.image[ti][tj];
          }
        }
      }
    }
    return img;
  }

  getCleanImage() {
    let img = [];
    for (let i = 0; i < this.imageSize * (this.tileSize - 2); i++) {
      img[i] = [];
      for (let j = 0; j < this.imageSize * (this.tileSize - 2); j++) {
        img[i][j] = ' ';
      }
    }

    for (let i = 0; i < this.imageSize; i++) {
      for (let j = 0; j < this.imageSize; j++) {
        let tile = this.solution[i][j];
        for (let ti = 1; ti < this.tileSize - 1; ti++) {
          for (let tj = 1; tj < this.tileSize - 1; tj++) {
            let imgi = i * (this.tileSize - 2) + ti - 1;
            let imgj = j * (this.tileSize - 2) + tj - 1;
            img[imgi][imgj] = tile.image[ti][tj];
          }
        }
      }
    }
    return img;
  }

  nextPos(i, j) {
    if (j < this.imageSize - 1) {
      return [i, j + 1];
    }
    if (i < this.imageSize - 1) {
      return [i + 1, 0];
    }
    return [-1, -1];
  }

  getTileOptions() {
    return this.tiles.filter(t => !this.used.has(t.id));
  }

  cloneImage(img) {
    return img.slice().map(row => row.slice())
  }

  cloneTile(tile) {
    let image = this.cloneImage(tile.image);
    return {
      ...tile,
      image
    };
  }

  rotate(matrix, rot) {
    for (let r = 0; r < rot; r++) {
      matrix = matrix.map((row, i) =>
        row.map((val, j) => matrix[matrix.length - 1 - j][i])
      );
    }
    return matrix;
  }

  flipX(matrix) {
    for (let i = 0; i < this.matrix.length; i++) {
      matrix[i].reverse();
    }
  }

  flipY(matrix) {
    matrix.reverse();
  }

  backtrack(currentI, currentJ) {
    let [nexti, nextj] = this.nextPos(currentI, currentJ);
    if (nexti === -1) {
      return true;
    }

    // console.log(nexti, nextj);
    let ti = 0;
    let options = this.getTileOptions();
    for (let tile of options) {
      ti++;
      this.progress.push(ti + '/' + options.length);
      console.log(this.progress.join(' '));
      // console.log(nexti, nextj, tile.id);
      for (let rot = 0; rot < 4; rot++) {
        for (let flipY of [false, true]) {
          // Originally I iterated over flipX as well, but that is not needed
          // as the combinations of rot and flipY cover all possible positions
          // with flipX this took hours and didn't even come close to a asolution
          // without flipX this takes a few sec
          let clone = this.cloneTile(tile);
          if (rot) {
            clone.image = this.rotate(clone.image, rot);
          }
          if (flipY) {
            this.flipY(clone.image);
          }
          clone.rot = rot;
          clone.flipY = flipY;
          if (this.isValid(nexti, nextj, clone)) {
            this.solution[nexti][nextj] = clone;
            this.used.add(clone.id);
            let solved = this.backtrack(nexti, nextj);
            this.used.delete(clone.id);
            if (solved) {
              return true;
            }
          }
        }
      }
      this.progress.pop();
    }

    this.solution[nexti][nextj] = null;
    return false;
  }

  isValid(i, j, tile) {
    let above = i < 1 ? null : this.solution[i - 1][j];
    let before = j < 1 ? null : this.solution[i][j - 1];

    if (!above && !before) {
      return true;
    }

    let rowAbove = above ? above.image[above.image.length - 1] : null;
    let colBefore = before ? before.image.map(row => row[row.length - 1]) : null;


    for (let k = 0; k < this.tileSize; k++) {
      if (rowAbove) {
        if (rowAbove[k] !== tile.image[0][k]) {
          return false;
        }
      }
      if (colBefore) {
        if (colBefore[k] !== tile.image[k][0]) {
          return false;
        }
      }
    }
    return true;
  }


}

fs.readFile('./input/input20.txt', 'utf8', (err, data) => {
  const tileLines = data.trim().split('\n\n');

  const tiles = [];
  for (let line of tileLines) {
    let lines = line.split('\n');
    let [_, id] = lines[0].match(/Tile (\d+):/);
    id = Number(id);
    lines.shift();
    let image = lines.map(line => line.split(''));
    tiles.push({
      id,
      image,
      rot: 0,
      flipX: false,
      flipY: false,
    });
  };

  let bt = new Backtrack(tiles);

  bt.loadSolution(`3539r2f 3137r0f 2341r2f 1879r3f 2213r3f 2087r0f 2803r2f 1373r0f 1913r3f 2719r1f 1069r1f 1571r0
  1987r3f 3413r2f 3947r2f 1973r2f 1283r1f 2293r0 3533r0 2039r0 3691r3 2843r0 2851r3f 1759r2f
  3671r0 2579r3 2029r1 1489r1 3769r1 3191r3f 2111r2f 1289r0f 1223r2f 2437r3 3319r0 1811r3
  2399r3 3547r0f 1303r1f 2957r0 1097r2f 3643r0 1451r2f 1367r3f 3847r3f 3881r3f 1297r3f 3697r2f
  3019r1 1741r3 1583r1 2939r0f 1559r1f 1697r0f 2927r1 1481r1f 1187r1f 1873r0f 2003r0f 2161r2f
  3943r2f 3821r1 1249r1f 2467r0f 1301r2f 2791r1 2693r1f 1667r0 3251r0 2297r1f 1531r2f 1319r1f
  3761r1 2857r1 2389r2f 1049r3 2017r3f 1009r2f 1543r2f 1117r1 2357r3 1423r0f 2063r2f 3929r1
  1777r3f 2459r2f 2011r1 3701r3 1511r3 1193r3f 1433r3 1621r0 2897r2f 3559r0 1163r3f 3323r1f
  1213r1 1789r0 2677r1 1993r2f 3491r0 2473r3 3557r3f 1951r1f 2699r0 2143r3f 3853r1f 1753r0
  2083r0f 1051r0f 3359r3f 2539r3f 1103r3f 3527r1f 2887r2f 2861r2f 3011r2f 1471r0f 2423r3f 1399r1
  3347r0f 3167r1 1181r1f 2687r0 1597r3 2113r0f 3469r1f 3581r0f 2089r0f 3463r0f 3511r1 3461r3
  3803r3f 2633r1 2243r0f 3911r1 2333r2f 3391r2f 3931r3 3331r2f 3229r1f 3593r2f 2417r1f 1439r0f`);

  // bt.solve();
  let result1 = bt.getResult();
  console.log('Result 1: ', result1);



  let result2 = bt.getResult2();
  console.log('Result 2: ', result2);

});