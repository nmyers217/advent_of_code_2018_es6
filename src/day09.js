const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const getDoublyLinkedRing = () => {
  const getNode = (val = null, next = null, prev = null) => ({
    val,
    next,
    prev
  });

  let curNode = getNode();
  curNode.next = curNode;
  curNode.prev = curNode;

  const getCurNode = () => curNode;
  const setVal = val => {
    curNode.val = val;
  };
  const addNext = val => {
    const newNode = getNode(val, curNode.next, curNode);
    curNode.next = newNode;
    newNode.next.prev = newNode;
  };
  const addPrev = val => {
    const newNode = getNode(val, curNode, curNode.prev);
    curNode.prev = newNode;
    newNode.prev.next = newNode;
  };
  const next = () => {
    curNode = curNode.next;
  };
  const prev = () => {
    curNode = curNode.prev;
  };
  const remove = () => {
    curNode.val = null;
    curNode.next.prev = curNode.prev;
    curNode.prev.next = curNode.next;
    curNode = curNode.next;
  };

  return {
    setVal,
    getCurNode,
    addNext,
    addPrev,
    next,
    prev,
    remove
  };
};

const filePath = path.join(__dirname, '..', 'res', 'day09.txt');
const input = fs.readFileSync(filePath).toString();

const getGameInfo = input => {
  const [_, players, lastMarble] = input.match(
    /(\d+) players; last marble is worth (\d+) points/
  );
  return { players: parseInt(players), lastMarble: parseInt(lastMarble) };
};

const playGame = gameInfo => {
  const { players, lastMarble } = gameInfo;
  const scores = Array(players).fill(0);
  const dlr = getDoublyLinkedRing();
  dlr.setVal(0);

  for (let m = 1, p = 0; m <= lastMarble; m++, p = (p + 1) % players) {
    if (m % 23 === 0) {
      scores[p] += m;
      Array(7)
        .fill()
        .map(() => dlr.prev());
      scores[p] += dlr.getCurNode().val;
      dlr.remove();
    } else {
      dlr.next();
      dlr.addNext(m);
      dlr.next();
    }
  }

  return scores.reduce((max, s) => (s > max ? s : max), 0);
};

console.log('Part 1 ==>', chalk.green(playGame(getGameInfo(input))));

const { players, lastMarble } = getGameInfo(input);
console.log(
  'Part 2 ==>',
  chalk.green(
    playGame({
      players,
      lastMarble: lastMarble * 100
    })
  )
);
