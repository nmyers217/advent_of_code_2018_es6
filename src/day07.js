const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const WORKER_COUNT = 5;
const SECOND_PENALTY = 60;

const filePath = path.join(__dirname, '..', 'res', 'day07.txt');
const input = fs
  .readFileSync(filePath)
  .toString()
  .split('\n');

const instructions = input.map(function parseInstruction(str) {
  const match = str.match(
    /Step ([A-Z]{1}) must be finished before step ([A-Z]{1}) can begin./
  );
  const [_, dependency, step] = match;
  return { dependency, step };
});

const getGraph = instructions => {
  const checkStep = (graph, step) => {
    if (!graph.hasOwnProperty(step)) {
      graph[step] = { prev: new Set(), next: new Set() };
    }
  };
  return instructions.reduce((graph, { dependency, step }) => {
    checkStep(graph, dependency);
    checkStep(graph, step);
    graph[dependency].next.add(step);
    graph[step].prev.add(dependency);
    return graph;
  }, {});
};

const getPrioQueue = () => {
  let elements = [];
  let size = 0;

  const enqueue = v => {
    elements.push(v);
    elements.sort();
    size++;
  };

  const dequeue = () => {
    size--;
    return elements.shift();
  };

  const getSize = () => size;

  return { enqueue, dequeue, getSize };
};

const partOne = instructions => {
  const g = getGraph(instructions);
  const q = getPrioQueue();

  Object.keys(g)
    .filter(k => g[k].prev.size === 0)
    .forEach(k => q.enqueue(k));

  let order = '';
  while (q.getSize()) {
    const completedStep = q.dequeue();
    order += completedStep;

    g[completedStep].next.forEach(nextStep => {
      g[nextStep].prev.delete(completedStep);
      if (g[nextStep].prev.size === 0) {
        q.enqueue(nextStep);
      }
    });
    g[completedStep].next.clear();
  }
  return order;
};

const getWorkers = (count = WORKER_COUNT) => {
  return Array(count)
    .fill()
    .map(() => ({
      task: null,
      completionSecond: null
    }));
};

const partTwo = instructions => {
  const g = getGraph(instructions);
  const q = getPrioQueue();
  const workers = getWorkers();

  Object.keys(g)
    .filter(k => g[k].prev.size === 0)
    .forEach(k => q.enqueue(k));

  let order = '';
  let second = 0;
  while (true) {
    workers.forEach(function checkComplete(w) {
      const isComplete = w.task && w.completionSecond === second;
      if (!isComplete) {
        return;
      }

      order += w.task;

      g[w.task].next.forEach(nextStep => {
        g[nextStep].prev.delete(w.task);
        if (g[nextStep].prev.size === 0) {
          q.enqueue(nextStep);
        }
      });
      g[w.task].next.clear();

      w.task = null;
      w.completionSecond = null;
    });

    workers.forEach(function assignTask(w) {
      if (w.task || !q.getSize()) {
        return;
      }
      w.task = q.dequeue();
      const taskTime = SECOND_PENALTY + w.task.charCodeAt() - 64;
      w.completionSecond = second + taskTime;
    });

    if (q.getSize() === 0 && workers.filter(w => w.task).length === 0) {
      break;
    }

    second++;
  }

  return second;
};

console.log('Part 1 ==>', chalk.green(partOne(instructions)));
console.log(
  `Part 2 ${chalk.magenta(
    `(WORKER_COUNT=${WORKER_COUNT}, SECOND_PENALTY=${SECOND_PENALTY})`
  )} ==>`,
  chalk.green(partTwo(instructions))
);
