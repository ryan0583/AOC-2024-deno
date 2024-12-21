import path from 'node:path';
import { readLines } from '../../fileParser';
import { Position } from '../../types';
import { isOnGrid } from '../../grid';
import { log } from 'node:console';
import { stdout } from 'node:process';

process.stdout.write('\x1Bc'); // Clear the console

const lines = readLines(path.resolve(), 'solutions/20/input.txt').map((line) =>
  line.split('')
);

const internalRaceTrack = lines
  .map((line) => line.slice(1, line.length - 1))
  .slice(1, lines.length - 1);

const maxX = internalRaceTrack[0].length;
const maxY = internalRaceTrack.length;

const start = {} as Position;
const target = {} as Position;
const walls = new Set<string>();

for (let y = 0; y < internalRaceTrack.length; y++) {
  for (let x = 0; x < internalRaceTrack[y].length; x++) {
    if (internalRaceTrack[y][x] === '#') {
      walls.add(`${x},${y}`);
    }
    if (internalRaceTrack[y][x] === 'S') {
      start.x = x;
      start.y = y;
    }
    if (internalRaceTrack[y][x] === 'E') {
      target.x = x;
      target.y = y;
    }
  }
}

const findRacetrackPath = () => {
  const path = new Set<string>([`${start.x},${start.y}`]);
  const current = { x: start.x, y: start.y };

  while (current.x !== target.x || current.y !== target.y) {
    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ].forEach(([dx, dy]) => {
      const x = current.x + dx;
      const y = current.y + dy;
      if (
        isOnGrid({ x, y }, maxX, maxY) &&
        !walls.has(`${x},${y}`) &&
        !path.has(`${x},${y}`)
      ) {
        path.add(`${x},${y}`);
        current.x = x;
        current.y = y;
      }
    });
  }

  return path;
};

const racetrack = [...findRacetrackPath()];

const getDistancesSavedMoreThan100 = (maxCollisionDisabledTime: number) => {
  const distancesSaved = [] as number[];

  for (let i = 0; i < racetrack.length; i++) {
    stdout.cursorTo(0, 0);
    log(i);
    for (let j = racetrack.length - 1; j > i + 100; j--) {
      const [cheatStartX, cheatStartY] = racetrack[i].split(',').map(Number);
      const [cheatEndX, cheatEndY] = racetrack[j].split(',').map(Number);

      const manhattanDistance =
        Math.abs(cheatEndX - cheatStartX) + Math.abs(cheatEndY - cheatStartY);

      if (
        manhattanDistance <= maxCollisionDisabledTime &&
        j - i - manhattanDistance >= 100
      ) {
        distancesSaved.push(j - i - manhattanDistance);
      }
    }
  }

  return distancesSaved;
};

const part1 = getDistancesSavedMoreThan100(2);
stdout.write('\x1Bc'); // Clear the console
const part2 = getDistancesSavedMoreThan100(20);
stdout.write('\x1Bc'); // Clear the console
log(part1.length);
log(part2.length);
