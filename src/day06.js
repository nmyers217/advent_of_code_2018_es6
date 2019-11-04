const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const R = require('ramda');

const GRID_SIZE = 850;
const MAX_DIST = 10000;

const filePath = path.join(__dirname, '..', 'res', 'day06.txt');
const points = fs
  .readFileSync(filePath)
  .toString()
  .split('\n')
  .map(function parseLine(line) {
    const [_, x, y] = line.match(/(\d+), (\d+)/);
    return { x, y };
  });

const getGrid = (size = GRID_SIZE) => R.repeat(R.repeat(0, size), size);

const partOne = points => {
  // Cells in the grid will store one of the following:
  // 1. an index to its closest point in `points`
  // 2. -1 because it was a tie
  const populateGrid = (grid, points) => {
    return grid.map((row, y) => {
      return row.map((val, x) => {
        const pointDistances = points.map(function manhattan(point) {
          return Math.abs(point.x - x) + Math.abs(point.y - y);
        });

        let smallest = { dist: Infinity, pointIndexes: [] };
        pointDistances.forEach(function checkSmallest(dist, i) {
          if (dist < smallest.dist) {
            smallest = { dist, pointIndexes: [i] };
          } else if (dist === smallest.dist) {
            smallest.pointIndexes.push(i);
          }
        });

        return smallest.pointIndexes.length === 1
          ? smallest.pointIndexes[0]
          : -1;
      });
    });
  };

  const grid = populateGrid(getGrid(), points);

  const infinites = (function calcInfinites(infinites) {
    grid[0].forEach(v => infinites.add(v));
    grid[grid.length - 1].forEach(v => infinites.add(v));
    grid.forEach(row => {
      infinites.add(row[0]);
      infinites.add(row[row.length - 1]);
    });
    return infinites;
  })(new Set());

  const areaSizeCounts = points.reduce((sizes, _, i) => {
    if (!infinites.has(i)) {
      sizes[i] = 0;
    }
    return sizes;
  }, {});

  grid.forEach(row => {
    row.forEach(pointIndex => {
      if (areaSizeCounts.hasOwnProperty(pointIndex)) {
        areaSizeCounts[pointIndex]++;
      }
    });
  });

  return Object.values(areaSizeCounts).reduce(
    (largest, c) => (c > largest ? c : largest),
    0
  );
};

const partTwo = points => {
  let areaSize = 0;

  getGrid().forEach((row, y) => {
    row.forEach((val, x) => {
      const total = points.reduce(function totalManhattan(total, point) {
        return total + Math.abs(point.x - x) + Math.abs(point.y - y);
      }, 0);
      if (total < MAX_DIST) {
        areaSize++;
      }
    });
  });

  return areaSize;
};

console.log(
  `Part 1 ${chalk.magenta(`(GRID_SIZE=${GRID_SIZE})`)} ==>`,
  chalk.green(partOne(points))
);
console.log(
  `Part 2 ${chalk.magenta(`(MAX_DIST=${MAX_DIST})`)} ==>`,
  chalk.green(partTwo(points))
);
