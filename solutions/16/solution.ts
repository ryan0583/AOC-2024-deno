import path from 'node:path';
import { readLines } from '../../fileParser';
import { Position } from '../../types';
import { log } from 'node:console';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/16/input.txt').map((line) =>
  line.split('')
);

const startPosition = {} as Position;
const endPosition = {} as Position;
const verticalTurnPositions = [] as Position[];
const horizontalTurnPositions = [] as Position[];
const wallPositions = [] as Position[];

lines.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === 'S') {
      startPosition.x = x;
      startPosition.y = y;
    } else if (cell === 'E') {
      endPosition.x = x;
      endPosition.y = y;
    } else if (cell === '.') {
      if (lines[y - 1][x] === '.' || lines[y + 1][x] === '.') {
        verticalTurnPositions.push({ x, y });
      }
      if (row[x - 1] === '.' || row[x + 1] === '.') {
        horizontalTurnPositions.push({ x, y });
      }
    } else if (cell === '#') {
      wallPositions.push({ x, y });
    }
  });
});

const horizontalPaths = [startPosition, ...verticalTurnPositions].flatMap(
  (position) => {
    const endPositions = [...verticalTurnPositions, endPosition].filter(
      (position2) =>
        position2.y === position.y &&
        position2.x > position.x &&
        !wallPositions.some(
          (wall) =>
            wall.x > position.x && wall.x < position2.x && wall.y === position.y
        )
    );

    return endPositions.map((endPosition) => ({
      start: position,
      end: endPosition,
    }));
  }
);

const verticalPaths = [endPosition, ...horizontalTurnPositions].flatMap(
  (position) => {
    const endPositions = [...horizontalTurnPositions, startPosition].filter(
      (position2) =>
        position2.x === position.x &&
        position2.y > position.y &&
        !wallPositions.some(
          (wall) =>
            wall.y > position.y && wall.y < position2.y && wall.x === position.x
        )
    );

    return endPositions.map((endPosition) => ({
      start: position,
      end: endPosition,
    }));
  }
);

// log(horizontalPaths);
// log(verticalPaths);

const appendNextPath = (path: { start: Position; end: Position }[]) => {
//   log(path);
  const lastPathPart = path[path.length - 1];
  if (
    lastPathPart.end.x === endPosition.x &&
    lastPathPart.end.y === endPosition.y
  ) {
    // log('found end');
    return [path];
  }

  const allPaths = [] as { start: Position; end: Position }[][];
  if (lastPathPart.start.x === lastPathPart.end.x) {
    horizontalPaths.forEach((nextPath) => {
      if (
        nextPath.start.x === lastPathPart.end.x &&
        nextPath.start.y === lastPathPart.end.y &&
        !path.some(
          ({ start, end }) =>
            start.x === nextPath.start.x &&
            start.y === nextPath.start.y &&
            end.x === nextPath.end.x &&
            end.y === nextPath.end.y
        )
      ) {
        allPaths.push(...appendNextPath([...path, nextPath]));
      }
      if (
        nextPath.end.x === lastPathPart.end.x &&
        nextPath.end.y === lastPathPart.end.y &&
        !path.some(
          ({ start, end }) =>
            start.x === nextPath.end.x &&
            start.y === nextPath.end.y &&
            end.x === nextPath.start.x &&
            end.y === nextPath.start.y
        )
      ) {
        allPaths.push(
          ...appendNextPath([
            ...path,
            { start: nextPath.end, end: nextPath.start },
          ])
        );
      }
    });
  } else if (lastPathPart.start.y === lastPathPart.end.y) {
    verticalPaths.forEach((nextPath) => {
      if (
        nextPath.start.x === lastPathPart.end.x &&
        nextPath.start.y === lastPathPart.end.y &&
        !path.some(
          ({ start, end }) =>
            start.x === nextPath.start.x &&
            start.y === nextPath.start.y &&
            end.x === nextPath.end.x &&
            end.y === nextPath.end.y
        )
      ) {
        allPaths.push(...appendNextPath([...path, nextPath]));
      }
      if (
        nextPath.end.x === lastPathPart.end.x &&
        nextPath.end.y === lastPathPart.end.y &&
        !path.some(
          ({ start, end }) =>
            start.x === nextPath.end.x &&
            start.y === nextPath.end.y &&
            end.x === nextPath.start.x &&
            end.y === nextPath.start.y
        )
      ) {
        allPaths.push(
          ...appendNextPath([
            ...path,
            { start: nextPath.end, end: nextPath.start },
          ])
        );
      }
    });
  }
  return allPaths;
};

const allPaths = [] as { start: Position; end: Position }[][];

const startVerticalPath = verticalPaths.find(
  (path) => path.end.x === startPosition.x && path.end.y === startPosition.y
);

// log(startVerticalPath);

if (startVerticalPath) {
  allPaths.push(
    ...appendNextPath([
      { start: startVerticalPath.end, end: startVerticalPath.start },
    ])
  );
}

const startHorizontalPath = horizontalPaths.find(
  (path) => path.start.x === startPosition.x && path.start.y === startPosition.y
);

// log(startHorizontalPath);

if (startHorizontalPath) {
  allPaths.push(...appendNextPath([startHorizontalPath]));
}

log(allPaths);

const pathScores = allPaths.map((path) => {
  const turns = path.length;
  const steps = sum(
    path.map(
      ({ start, end }) => Math.abs(start.x - end.x) + Math.abs(start.y - end.y)
    )
  );
  return turns * 1000 + steps;
});

log(Math.min(...pathScores));

// // log(startPosition);
// // log(endPosition);
// // log([...wallPositions]);

// const directions: ('^' | '>' | 'v' | '<')[] = ['^', '>', 'v', '<'];

// const getNewForwardPosition = (
//   position: Position,
//   direction: '^' | '>' | 'v' | '<'
// ) => {
//   if (direction === '^') {
//     return { x: position.x, y: position.y - 1 };
//   } else if (direction === '>') {
//     return { x: position.x + 1, y: position.y };
//   } else if (direction === 'v') {
//     return { x: position.x, y: position.y + 1 };
//   }
//   return { x: position.x - 1, y: position.y };
// };

// const getNewLeftPosition = (
//   position: Position,
//   direction: '^' | '>' | 'v' | '<'
// ) => {
//   if (direction === '^') {
//     return { x: position.x - 1, y: position.y };
//   } else if (direction === '>') {
//     return { x: position.x, y: position.y - 1 };
//   } else if (direction === 'v') {
//     return { x: position.x + 1, y: position.y };
//   }
//   return { x: position.x, y: position.y + 1 };
// };

// const getNewRightPosition = (
//   position: Position,
//   direction: '^' | '>' | 'v' | '<'
// ) => {
//   if (direction === '^') {
//     return { x: position.x + 1, y: position.y };
//   } else if (direction === '>') {
//     return { x: position.x, y: position.y + 1 };
//   } else if (direction === 'v') {
//     return { x: position.x - 1, y: position.y };
//   }
//   return { x: position.x, y: position.y - 1 };
// };

// const move = (
//   position: Position,
//   direction: '^' | '>' | 'v' | '<',
//   path: Set<string>,
//   pathScore: number
// ) => {
//   const key = `${position.x},${position.y}`;
//   if (path.has(key)) {
//     return [{ path: new Set() as Set<string>, score: 0 }];
//   }
//   path.add(key);

//   const allPaths = [] as { path: Set<string>; score: number }[];
//   if (position.x === endPosition.x && position.y === endPosition.y) {
//     allPaths.push({ path, score: pathScore });
//   } else {
//     const newForwardPosition = getNewForwardPosition(position, direction);
//     if (!wallPositions.has(`${newForwardPosition.x},${newForwardPosition.y}`)) {
//       const forwardPaths = move(
//         newForwardPosition,
//         direction,
//         new Set(path),
//         pathScore + 1
//       );

//       allPaths.push(...forwardPaths);
//     }

//     const newLeftPosition = getNewLeftPosition(position, direction);
//     if (!wallPositions.has(`${newLeftPosition.x},${newLeftPosition.y}`)) {
//       //   log('Turning');
//       const newDirectionIndex =
//         directions.indexOf(direction) - 1 < 0
//           ? 3
//           : directions.indexOf(direction) - 1;
//       const newDirection = directions[newDirectionIndex];
//       const leftPaths = move(
//         newLeftPosition,
//         newDirection,
//         new Set(path),
//         pathScore + 1001
//       );

//       allPaths.push(...leftPaths);
//     }

//     const newRightPosition = getNewRightPosition(position, direction);
//     if (!wallPositions.has(`${newRightPosition.x},${newRightPosition.y}`)) {
//       //   log('Turning');
//       const newDirection = directions[(directions.indexOf(direction) + 1) % 4];
//       const rightPaths = move(
//         newRightPosition,
//         newDirection,
//         new Set(path),
//         pathScore + 1001
//       );

//       allPaths.push(...rightPaths);
//     }
//   }
//   return allPaths;
// };

// const paths = move(startPosition, '>', new Set(), 0);
// // log(paths.filter(({ score }) => score > 0).map(({ path }) => [...path]));

// log(Math.min(...paths.map(({ score }) => score).filter((score) => score > 0)));
