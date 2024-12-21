import path from 'node:path';
import { readLines } from '../../fileParser';
import { Position } from '../../types';
import { isOnGrid } from '../../grid';
import { log } from 'node:console';

process.stdout.write('\x1Bc'); // Clear the console

const lines = readLines(path.resolve(), 'solutions/20/input.txt').map((line) =>
  line.split('')
);

const internalRaceTrack = lines.map((line) => line.slice(1, line.length - 1)).slice(1, lines.length - 1);

// for (let y = 0; y < internalRaceTrack.length; y++) {
//   for (let x = 0; x < internalRaceTrack[y].length; x++) {
//     stdout.write(internalRaceTrack[y][x]);
//   }
//   stdout.write('\n');
// }

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

// log(racetrack);

const distancesSaved = [] as number[];

// each wall is a potential set of cheats
for (const wall of walls) {
  const [wallX, wallY] = wall.split(',').map(Number);
  const cheatsIndices = [] as number[];
  [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ].forEach(([dx, dy]) => {
    const x = wallX + dx;
    const y = wallY + dy;
    const racetrackIndex = racetrack.indexOf(`${x},${y}`);
    if (
      racetrackIndex !== -1
    ) {
      cheatsIndices.push(racetrackIndex);
    }
  })

  cheatsIndices.sort((a, b) => a - b);
  
  if (cheatsIndices.length > 1) { 
    distancesSaved.push(cheatsIndices[1] - cheatsIndices[0] - 2);
  }
  if (cheatsIndices.length > 2) {
    distancesSaved.push(cheatsIndices[2] - cheatsIndices[1] - 2);
    distancesSaved.push(cheatsIndices[2] - cheatsIndices[0] - 2);
  }
}

// log(distancesSaved.sort((a, b) => b - a));

log(distancesSaved.filter((distance) => distance >= 100).length);
