const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'res', 'day08.txt');
const input = fs
  .readFileSync(filePath)
  .toString()
  .split(' ');

const getNode = (numChildren = 0, numMetadata = 0) => ({
  numChildren,
  numMetadata,
  children: [],
  metaData: []
});

const getTree = input => {
  let i = 0;

  const recurse = () => {
    const n = getNode(parseInt(input[i++]), parseInt(input[i++]));

    for (let c = 0; c < n.numChildren; c++) {
      n.children.push(recurse());
    }

    for (let m = 0; m < n.numMetadata; m++) {
      n.metaData.push(parseInt(input[i++]));
    }

    return n;
  };

  return recurse();
};

const sum = arr => arr.reduce((sum, el) => sum + el, 0);

const partOne = input => {
  const tree = getTree(input);

  const recurse = node => {
    return sum(node.metaData) + sum(node.children.map(n => recurse(n)));
  };

  return recurse(tree);
};

const partTwo = input => {
  const tree = getTree(input);

  const recurse = node => {
    if (node.children.length === 0) {
      return sum(node.metaData);
    }

    const childValues = node.metaData
      .map(i => i - 1)
      .filter(i => i >= 0 && i < node.children.length)
      .map(i => recurse(node.children[i]));

    return sum(childValues);
  };

  return recurse(tree);
};

console.log('Part 1 ==>', chalk.green(partOne(input)));
console.log('Part 2 ==>', chalk.green(partTwo(input)));
