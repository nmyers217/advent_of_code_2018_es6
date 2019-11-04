const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const filePath = path.join(__dirname, '..', 'res', 'day05.txt');
const input = fs.readFileSync(filePath).toString();

const getPolymer = input => [...input];

const getChardCodeDiff = (c1, c2) =>
  Math.abs(c1.charCodeAt() - c2.charCodeAt());

const isReaction = (c1, c2) => getChardCodeDiff(c1, c2) === 32;

const solvePolymer = polymer => {
  let i = 0;
  while (i < polymer.length - 1) {
    if (isReaction(polymer[i], polymer[i + 1])) {
      polymer.splice(i, 2);
      if (i > 0) {
        i -= 1;
      }
    } else {
      i += 1;
    }
  }
  return polymer.join('').length;
};

const partOne = input => solvePolymer(getPolymer(input));

const partTwo = input => {
  const units = [];
  for (let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); i++) {
    units.push(String.fromCharCode(i));
  }

  const counts = units.map(function fixPolymer(unit) {
    const polymer = getPolymer(input).filter(c => c.toUpperCase() !== unit);
    return solvePolymer(polymer);
  });

  return counts.reduce(
    (lowest, count) => (count < lowest ? count : lowest),
    Infinity
  );
};

console.log('Part 1 ==>', chalk.green(partOne(input)));
console.log('Part 2 ==>', chalk.green(partTwo(input)));
