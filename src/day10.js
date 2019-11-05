const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// NOTE: i manually adjusted these to get something that looked good
const GRID_ROWS = 12;
const GRID_COLS = 80;
const OFFSET_X = 4;
const OFFSET_Y = 1;

const filePath = path.join(__dirname, '..', 'res', 'day10.txt');
const input = fs
  .readFileSync(filePath)
  .toString()
  .split('\n');

const getPoints = input => {
  return input
    .map(line => {
      const [_, x, y, vx, vy] = line.match(
        /position=<(.+),(.+)> velocity=<(.+),(.+)>/
      );
      return [x, y, vx, vy].map(str => parseInt(str.trim()));
    })
    .map(([x, y, vx, vy]) => ({ x, y, vx, vy }))
    .sort((p1, p2) => {
      const a = Math.abs(p1.x + p1.y);
      const b = Math.abs(p2.x + p2.y);
      if (a < b) {
        return -1;
      } else if (a === b) {
        return 0;
      } else {
        return 1;
      }
    });
};

const advancePoints = points => time => {
  return points.map(({ x, y, vx, vy }) => ({
    x: x + vx * time,
    y: y + vy * time,
    vx,
    vy
  }));
};

const checkForMessage = points => {
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];

    let hasNeighbor = false;
    for (let j = 0; j < points.length; j++) {
      const p2 = points[j];
      if (p1.x === p2.x && p1.y === p2.y) {
        continue;
      }

      if (Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y) <= 2) {
        hasNeighbor = true;
        break;
      }
    }

    if (!hasNeighbor) {
      return false;
    }
  }

  return true;
};

const solve = input => {
  const points = getPoints(input);
  const nextPointsFn = advancePoints(points);

  let time = 1;
  while (!checkForMessage(nextPointsFn(time))) {
    time++;
  }

  const grid = Array(GRID_ROWS)
    .fill()
    .map(() =>
      Array(GRID_COLS)
        .fill()
        .map(() => '.')
    );

  const goodPoints = nextPointsFn(time);
  const offset = {
    x: goodPoints[0].x - OFFSET_X,
    y: goodPoints[0].y - OFFSET_Y
  };
  nextPointsFn(time).forEach(({ x, y }) => {
    const p = { x: x - offset.x, y: y - offset.y };
    if (p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length) {
      grid[p.y][p.x] = '#';
    }
  });

  return { time, message: '\n' + grid.map(r => r.join('')).join('\n') };
};

const { message, time } = solve(input);

console.log(
  `Part 1 ${chalk.magenta(
    `(GRID_ROWS=${GRID_ROWS} GRID_COLS=${GRID_COLS})`
  )} ==>`,
  chalk.green(message)
);
console.log(
  `Part 2 ${chalk.magenta(
    `(GRID_ROWS=${GRID_ROWS} GRID_COLS=${GRID_COLS})`
  )} ==>`,
  chalk.green(time)
);
