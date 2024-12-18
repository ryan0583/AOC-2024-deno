import path from 'node:path';
import { readLines } from '../../fileParser';
import { Position } from '../../types';
import { log } from 'node:console';

process.stdout.write('\x1Bc'); // Clear the console

const checkArr = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

const maxX = 71;
const maxY = 71;

const isOnGrid = ({ x, y }: Position) =>
  x >= 0 && x <= maxX - 1 && y >= 0 && y <= maxY - 1;

const lines = readLines(path.resolve(), 'solutions/18/input.txt').map(
  (line) => ({
    x: Number(line.split(',')[0]),
    y: Number(line.split(',')[1]),
  })
);

const start = { x: 0, y: 0 };
const target = { x: maxX - 1, y: maxY - 1 };

const findMinPath = async () => {
  const coorindateLimit = 1024;

  const truncatedLines = lines.slice(0, coorindateLimit);

  const walls = new Set<string>();

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (truncatedLines.some((line) => line.x === x && line.y === y)) 
        walls.add(`${x},${y}`);
    }
  }

  const visited = new Set<string>();
  const positionQueue = [{ pos: start, cost: 0, path: new Set<string>() }];

  while (positionQueue.length > 0) {
    // Sort the queue to prioritise the node with the lowest cost
    positionQueue.sort((a, b) => a.cost - b.cost);
    const current = positionQueue.shift()!;

    const stateKey = `${current.pos.x},${current.pos.y}`;
    visited.add(stateKey);

    if (current.pos.x === target.x && current.pos.y === target.y) {
      return current;
    }

    checkArr.forEach(([dx, dy]) => {
      const x = current.pos.x + dx;
      const y = current.pos.y + dy;
      const nextKey = `${x},${y}`;

      if (
        isOnGrid({ x, y }) &&
        !visited.has(nextKey) &&
        !walls.has(nextKey) &&
        !positionQueue.some((p) => p.pos.x === x && p.pos.y === y)
      ) {
        positionQueue.push({
          pos: { x, y },
          cost:
            current.path.size + Math.abs(x - target.x) + Math.abs(y - target.y),
          path: new Set([...current.path, stateKey]),
        });
      }
    });
  }
};

const findAnyPath = (walls: Set<string>) => {
  const visited = new Set<string>();
  const positionQueue = [{ pos: start, cost: 0, path: new Set<string>() }];

  while (positionQueue.length > 0) {
    // Sort the queue to prioritise the node with the lowest cost
    positionQueue.sort((a, b) => a.cost - b.cost);
    const current = positionQueue.shift()!;

    const stateKey = `${current.pos.x},${current.pos.y}`;
    visited.add(stateKey);

    if (current.pos.x === target.x && current.pos.y === target.y) {
      return current;
    }

    checkArr.forEach(([dx, dy]) => {
      const x = current.pos.x + dx;
      const y = current.pos.y + dy;
      const nextKey = `${x},${y}`;

      if (
        isOnGrid({ x, y }) &&
        !visited.has(nextKey) &&
        !walls.has(nextKey) &&
        !positionQueue.some((p) => p.pos.x === x && p.pos.y === y)
      ) {
        positionQueue.push({
          pos: { x, y },
          cost: Math.abs(x - target.x) + Math.abs(y - target.y),
          path: new Set([...current.path, stateKey]),
        });
      }
    });
  }
};

const findFirstWithNoPath = async () => {
  let min = 1024;
  let max = lines.length;

  while (Math.abs(max - min) > 1) {
    const mid = Math.floor((min + max) / 2);
    const truncatedLines = lines.slice(0, mid);

    const walls = new Set<string>();
    
    process.stdout.cursorTo(0, 0);
    log(mid);
    // log(min);
    // log(max);
    // log(mid);
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        if (truncatedLines.some((line) => line.x === x && line.y === y)) {
          walls.add(`${x},${y}`);
            process.stdout.write('#');
        } else {
            process.stdout.write('.');
        }
      }
        process.stdout.write('\n');
    }

    const mazePath = findAnyPath(walls);

    process.stdout.cursorTo(0, 1);
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        if (mazePath?.path.has(`${x},${y}`)) {
          process.stdout.write('O');
        } else if (walls.has(`${x},${y}`)) {
          walls.add(`${x},${y}`);
          process.stdout.write('#');
        } else {
          process.stdout.write('.');
        }
      }
      process.stdout.write('\n');
    }
    console.log(mazePath ? 'Path found' : 'No path found');
    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (mazePath) {
      min = mid;
    } else {
      max = mid;
    }

    process.stdout.write('\x1Bc'); // Clear the console
  }

  return lines[min];
};

const firstPointWithNoPath = await findFirstWithNoPath();
const bestPath = await findMinPath();
log(bestPath?.path.size);
log(`${firstPointWithNoPath.x},${firstPointWithNoPath.y}`);
