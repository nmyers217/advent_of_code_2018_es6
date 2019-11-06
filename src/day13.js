const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'res', 'day13.txt');
const input = fs.readFileSync(filePath).toString();

const TRACK_SYMBOLS = {
  STRAIGHT: new Set(['-', '|']),
  TURN: new Set(['/', '\\']),
  INTERSECTION: new Set(['+']),
  CART: new Set(['v', '<', '>', '^']),
  EMPTY: new Set([' '])
};

const getTrack = input => {
  return input.split('\n').map(line => line.split(''));
};

const getCarts = track => {
  const cartDirs = {
    v: { dx: +0, dy: +1 },
    '<': { dx: -1, dy: +0 },
    '>': { dx: +1, dy: +0 },
    '^': { dx: +0, dy: -1 }
  };

  const getTurnList = () => {
    const left = { dir: 'LEFT', next: null };
    const straight = { dir: null, next: null };
    const right = { dir: 'RIGHT', next: null };
    left.next = straight;
    straight.next = right;
    right.next = left;
    return { turn: left };
  };

  const result = [];
  for (let y = 0; y < track.length; y++) {
    for (let x = 0; x < track[y].length; x++) {
      const symbol = track[y][x];
      if (TRACK_SYMBOLS.CART.has(symbol)) {
        result.push({ x, y, ...cartDirs[symbol], ...getTurnList() });
      }
    }
  }
  return result;
};

// Ticks the carts using a given track
// if a collision occurs, the tick is not finished and a location is returned
// otherwise the tick is finished and false is returned
const tickCartsWithTrack = track => (
  carts = [],
  opts = { stopAfterCollision: true }
) => {
  carts.sort((c1, c2) => {
    if (c1.y < c2.y) {
      return -1;
    } else if (c1.y === c2.y) {
      if (c1.x < c2.x) {
        return -1;
      } else if (c1.x == c2.x) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  });

  for (let i = 0; i < carts.length; i++) {
    const c = carts[i];

    if (c.x === null || c.y === null) {
      continue;
    }

    const next = { x: c.x + c.dx, y: c.y + c.dy };
    const collisions = carts
      .map(({ x, y }) => ({ x, y }))
      .filter(({ x, y }) => x === next.x && y === next.y);

    if (collisions.length > 0) {
      if (opts.stopAfterCollision) {
        return collisions.shift();
      }
      carts.forEach(c => {
        if (c.x === next.x && c.y === next.y) {
          c.x = c.y = null;
        }
      });
      c.x = c.y = null;
      continue;
    }

    c.x = next.x;
    c.y = next.y;

    const symbol = track[c.y][c.x];
    const symbolType = Object.keys(TRACK_SYMBOLS)
      .filter(k => TRACK_SYMBOLS[k].has(symbol))
      .shift();
    const rotate = (clockwise = true) => {
      const temp = c.dx;
      c.dx = clockwise ? -c.dy : c.dy;
      c.dy = clockwise ? temp : -temp;
    };
    const symbolActions = {
      STRAIGHT: () => {},
      CART: () => {},
      EMPTY: () => {},
      TURN: () => {
        if (c.dy === -1) return rotate(symbol === '/');
        if (c.dy === 1) return rotate(symbol === '/');
        if (c.dx === -1) return rotate(symbol === '\\');
        if (c.dx === 1) return rotate(symbol === '\\');
      },
      INTERSECTION: () => {
        if (c.turn.dir === 'LEFT') rotate(false);
        if (c.turn.dir === 'RIGHT') rotate();
        c.turn = c.turn.next;
      }
    };
    symbolActions[symbolType]();
  }

  return false;
};

const partOne = input => {
  const track = getTrack(input);
  const carts = getCarts(track);
  const tick = tickCartsWithTrack(track);

  let collision = false;
  while (!collision) {
    collision = tick(carts);
  }
  return Object.values(collision);
};

const partTwo = input => {
  const track = getTrack(input);
  const carts = getCarts(track);
  const tick = tickCartsWithTrack(track);

  const getAliveCarts = () =>
    carts.filter(({ x, y }) => x !== null && y !== null);

  while (getAliveCarts().length > 1) {
    tick(carts, { stopAfterCollision: false });
  }

  return getAliveCarts()
    .map(({ x, y }) => [x, y])
    .shift()
    .join();
};

console.log('Part 1 ==>', chalk.green(partOne(input)));
console.log('Part 2 ==>', chalk.green(partTwo(input)));
