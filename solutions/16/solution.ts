import path from 'node:path';
import { readLines } from '../../fileParser';
import { Position } from '../../types';

process.stdout.write('\x1Bc'); // Clear the console

const directions = [
  { x: 1, y: 0 }, // East
  { x: 0, y: 1 }, // South
  { x: -1, y: 0 }, // West
  { x: 0, y: -1 }, // North
];

function findMinCostPath(maze: string[][], start: Position, end: Position) {
  const visited = new Set<string>();
  const positionQueue = [{ pos: start, dir: 0, cost: 0, path: [] as string[] }]; // Start facing East

  while (positionQueue.length > 0) {
    // Sort the queue to prioritise the node with the lowest cost
    positionQueue.sort((a, b) => a.cost - b.cost);
    const current = positionQueue.shift()!;
    // console.log(current.cost)

    const stateKey = `${current.pos.x},${current.pos.y},${current.dir}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    if (current.pos.x === end.x && current.pos.y === end.y) {
      return current;
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
        path: [...current.path, `${forwardPos.x},${forwardPos.y}`],
      });
    }

    // Rotate clockwise (right)
    positionQueue.push({
      pos: current.pos,
      dir: (current.dir + 1) % 4,
      cost: current.cost + 1000,
      path: [...current.path, 'R'],
    });

    // Rotate counterclockwise (left)
    positionQueue.push({
      pos: current.pos,
      dir: current.dir - 1 < 0 ? 3 : current.dir - 1,
      cost: current.cost + 1000,
      path: [...current.path, 'L'],
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

console.log(findMinCostPath(maze, start, end)?.cost);

function findAllShortestPaths(
  maze: string[][],
  start: Position,
  end: Position
) {
  //   const visited = new Set<string>();
  const positionQueue = [
    {
      pos: start,
      dir: 0,
      cost: 0,
      path: new Set([`${start.x},${start.y}`]),
    },
  ]; // Start facing East

  let minCost = Infinity;
  const paths = new Set<string>();

  const visited = {} as Record<string, number>;

  while (positionQueue.length > 0) {
    // Sort the queue to prioritise the node with the lowest cost
    positionQueue.sort((a, b) => a.cost - b.cost);
    const current = positionQueue.shift()!;

    const stateKey = `${current.pos.x},${current.pos.y},${current.dir}`;
    if (visited[stateKey] && visited[stateKey] < current.cost) continue;
    visited[stateKey] = current.cost;

    console.log(current.cost);

    if (minCost < current.cost) return paths;

    if (current.pos.x === end.x && current.pos.y === end.y) {
      minCost = current.cost;
      current.path.forEach((p) => paths.add(p));
    }

    // Move forward
    const forwardPos = {
      x: current.pos.x + directions[current.dir].x,
      y: current.pos.y + directions[current.dir].y,
    };

    if (
      maze[forwardPos.y][forwardPos.x] !== '#' &&
      !current.path.has(`${forwardPos.x},${forwardPos.y}`)
    ) {
      positionQueue.push({
        pos: forwardPos,
        dir: current.dir,
        cost: current.cost + 1,
        path: new Set([...current.path, `${forwardPos.x},${forwardPos.y}`]),
      });
    }

    // Rotate clockwise (right)
    if (
      !positionQueue.some(
        (p) =>
          p.pos.x === current.pos.x &&
          p.pos.y === current.pos.y &&
          p.dir === (current.dir + 1) % 4 &&
          [...p.path].join('') === [...current.path].join('')
      )
    ) {
      positionQueue.push({
        pos: current.pos,
        dir: (current.dir + 1) % 4,
        cost: current.cost + 1000,
        path: current.path,
      });
    }

    // Rotate counterclockwise (left)
    if (
      !positionQueue.some(
        (p) =>
          p.pos.x === current.pos.x &&
          p.pos.y === current.pos.y &&
          p.dir === (current.dir - 1 < 0 ? 3 : current.dir - 1) &&
          [...p.path].join('') === [...current.path].join('')
      )
    ) {
      positionQueue.push({
        pos: current.pos,
        dir: current.dir - 1 < 0 ? 3 : current.dir - 1,
        cost: current.cost + 1000,
        path: current.path,
      });
    }

    // process.stdout.cursorTo(0, 0);
    // for (let y = 0; y < maze.length; y++) {
    //   for (let x = 0; x < maze[y].length; x++) {
    //     if (current.path.has(`${x},${y}`)) {
    //       process.stdout.write('0');
    //     } else {
    //       process.stdout.write(maze[y][x]);
    //     }
    //   }
    //   process.stdout.write('\n');
    // }
  }

  return paths;
}

const allPathPoints = await findAllShortestPaths(maze, start, end);

// console.log(allPathPoints);

// process.stdout.cursorTo(0, 0);
// for (let y = 0; y < maze.length; y++) {
//   for (let x = 0; x < maze[y].length; x++) {
//     if (allPathPoints.has(`${x},${y}`)) {
//       process.stdout.write('0');
//     } else {
//       process.stdout.write(maze[y][x]);
//     }
//   }
//   process.stdout.write('\n');
// }

console.log(allPathPoints.size);
