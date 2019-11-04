const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'res', 'day04.txt');
const lines = fs
  .readFileSync(inputPath)
  .toString()
  .split('\n');
const log = lines
  .map(function parseGuard(line) {
    const match = line.match(/\[(.+)\] (.+)/);
    const time = new Date(match[1]);
    const action = match[2];
    const guardMatch = action.match(/Guard #(\d+) begins shift/);
    const guard = guardMatch ? parseInt(guardMatch[1]) : null;
    return { time, action, guard };
  })
  .sort((a, b) => {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  });

const guards = {};
let activeGuard = null;
let sleptAt = null;
for (let i = 0; i < log.length; i++) {
  const entry = log[i];

  if (entry.guard) {
    if (!guards.hasOwnProperty(entry.guard)) {
      guards[entry.guard] = [];
      for (let m = 0; m < 60; m++) {
        guards[entry.guard].push(0);
      }
    }
    activeGuard = entry.guard;
  } else if (entry.action === 'falls asleep') {
    sleptAt = entry.time.getMinutes();
  } else {
    const wokeAt = entry.time.getMinutes();
    for (let m = sleptAt; m < wokeAt; m++) {
      guards[activeGuard][m]++;
    }
  }
}

let sleepiest = { id: null, minutes: null };
Object.keys(guards).forEach(key => {
  const sum = guards[key].reduce((a, b) => a + b, 0);
  if (sum > sleepiest.minutes) {
    sleepiest = { id: parseInt(key), minutes: sum };
  }
});
let sleepiestMinute = { val: null, i: null };
guards[sleepiest.id].forEach((val, i) => {
  if (val > sleepiestMinute.val) {
    sleepiestMinute = { val, i };
  }
});
console.log('Part 1:', sleepiest.id * sleepiestMinute.i);
