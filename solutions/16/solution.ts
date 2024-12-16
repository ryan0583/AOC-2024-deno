import path from 'node:path';
import { readLines } from '../../fileParser';
import { Position } from '../../types';

process.stdout.write('\x1Bc'); // Clear the console

const directions = [
  { x: 0, y: 1 }, // East
  { x: 1, y: 0 }, // South
  { x: 0, y: -1 }, // West
  { x: -1, y: 0 }, // North
];

function findMinCostPath(maze: string[][], start: Position, end: Position) {
  const visited = new Set<string>();
  const positionQueue = [{ pos: start, dir: 0, cost: 0 }]; // Start facing East

  while (positionQueue.length > 0) {
    // Sort the queue to prioritise the node with the lowest cost
    positionQueue.sort((a, b) => a.cost - b.cost);
    const current = positionQueue.shift()!;
    // console.log(current.cost)

    const stateKey = `${current.pos.x},${current.pos.y},${current.dir}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    if (current.pos.x === end.x && current.pos.y === end.y) {
      return current.cost;
    }

    // Move forward
    const forwardPos = {
      x: current.pos.x + directions[current.dir].x,
      y: current.pos.y + directions[current.dir].y,
    };

    if (maze[forwardPos.y][forwardPos.x] !== '#') {
      positionQueue.push({
        pos: forwardPos,
        dir: current.dir,
        cost: current.cost + 1,
      });
    }

    // Rotate clockwise (right)
    positionQueue.push({
      pos: current.pos,
      dir: (current.dir + 1) % 4,
      cost: current.cost + 1000,
    });

    // Rotate counterclockwise (left)
    positionQueue.push({
      pos: current.pos,
      dir: (current.dir + 3) % 4,
      cost: current.cost + 1000,
    });
  }
}

// Example maze
const maze = readLines(path.resolve(), 'solutions/16/input.txt').map((line) =>
  line.split('')
);

const start = {} as Position;
const end = {} as Position;

for (let y = 0; y < maze.length; y++) {
  for (let x = 0; x < maze[y].length; x++) {
    if (maze[y][x] === 'S') {
      start.x = x;
      start.y = y;
    } else if (maze[y][x] === 'E') {
      end.x = x;
      end.y = y;
    }
  }
}

console.log(findMinCostPath(maze, start, end));

const findAllPossibleBestPaths = async (
  maze: string[][],
  start: Position,
  end: Position
) => {
  const openList = [{ pos: start, dir: 0, cost: 0, path: [start] }]; // Start facing East

  const pathPoints = new Set<string>();
  let minCost = Infinity;

  while (openList.length > 0) {
    // Sort the open list to prioritize the node with the lowest cost
    openList.sort((a, b) => a.cost - b.cost);
    const current = openList.shift()!;

    if (current.cost > minCost) {
      return pathPoints;
    }

    if (current.pos.x === end.x && current.pos.y === end.y) {
      current.path.forEach(({ x, y }) => pathPoints.add(`${x},${y}`));
      minCost = current.cost;
      continue;
    }

    // Move forward
    const forwardPos = {
      x: current.pos.x + directions[current.dir].x,
      y: current.pos.y + directions[current.dir].y,
    };

    if (
      maze[forwardPos.y][forwardPos.x] !== '#' &&
      !current.path.some(
        (pos) => pos.x === forwardPos.x && pos.y === forwardPos.y
      ) &&
      !openList.some(
        (pos) =>
          pos.pos.x === forwardPos.x &&
          pos.pos.y === forwardPos.y &&
          pos.dir === current.dir
      )
    ) {
      openList.push({
        pos: forwardPos,
        dir: current.dir,
        cost: current.cost + 1,
        path: [...current.path, forwardPos],
      });
    }

    // Rotate clockwise (right)
    openList.push({
      pos: current.pos,
      dir: (current.dir + 1) % 4,
      cost: current.cost + 1000,
      path: [...current.path],
    });

    // Rotate counterclockwise (left)
    openList.push({
      pos: current.pos,
      dir: (current.dir + 3) % 4,
      cost: current.cost + 1000,
      path: [...current.path],
    });

    process.stdout.cursorTo(0, 0);
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (current.path.some((pos) => pos.x === x && pos.y === y)) {
          process.stdout.write('0');
        } else {
          process.stdout.write(maze[y][x]);
        }
      }
      process.stdout.write('\n');
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

const allPathPoints = await findAllPossibleBestPaths(maze, start, end);

process.stdout.cursorTo(0, 0);
for (let y = 0; y < maze.length; y++) {
  for (let x = 0; x < maze[y].length; x++) {
    if (allPathPoints.has(`${x},${y}`)) {
      process.stdout.write('0');
    } else {
      process.stdout.write(maze[y][x]);
    }
  }
  process.stdout.write('\n');
}

console.log(allPathPoints.size);
