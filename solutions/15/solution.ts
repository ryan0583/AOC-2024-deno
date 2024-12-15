import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { Position } from '../../types';
import { sum } from '../../arrays';

process.stdout.write('\x1Bc'); // Clear the console

const lines = readLines(path.resolve(), 'solutions/15/input.txt')
  .join(';')
  .split(';;');

const map = lines[0].split(';').map((row) => row.split(''));
const moves = lines[1].split(';').join('').split('');

const part1 = () => {
  const robotPosition = {} as Position;
  let boxPositions = [] as Position[];
  const wallPositions = [] as Position[];

  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        wallPositions.push({ x, y });
      } else if (cell === 'O') {
        boxPositions.push({ x, y });
      } else if (cell === '@') {
        robotPosition.x = x;
        robotPosition.y = y;
      }
    });
  });

  const newMap = JSON.parse(JSON.stringify(map)) as string[][];
  moves.forEach((move, index) => {
    process.stdout.cursorTo(0);
    process.stdout.write(`Move ${index + 1}/${moves.length}`);
    const moveDirection = { x: 0, y: 0 };
    if (move === '^') moveDirection.y = -1;
    else if (move === 'v') moveDirection.y = 1;
    else if (move === '<') moveDirection.x = -1;
    else if (move === '>') moveDirection.x = 1;

    const nextPosition = { ...robotPosition };
    let nextChar = '.';
    const boxesToMove = [] as Position[];
    let foundSpace = false;
    while (nextChar !== '#' && !foundSpace) {
      nextPosition.x += moveDirection.x;
      nextPosition.y += moveDirection.y;
      nextChar = newMap[nextPosition.y][nextPosition.x];
      if (nextChar === 'O') boxesToMove.push({ ...nextPosition });
      if (nextChar === '.') foundSpace = true;
    }

    if (foundSpace) {
      robotPosition.x += moveDirection.x;
      robotPosition.y += moveDirection.y;

      boxPositions = boxPositions.filter(
        (b) => !boxesToMove.some((box) => box.x === b.x && box.y === b.y)
      );

      boxesToMove.forEach((box) => {
        boxPositions.push({
          x: box.x + moveDirection.x,
          y: box.y + moveDirection.y,
        });
      });

      map.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (robotPosition.x === x && robotPosition.y === y)
            newMap[y][x] = '@';
          else if (boxPositions.some((box) => box.x === x && box.y === y))
            newMap[y][x] = 'O';
          else if (cell === '#') newMap[y][x] = '#';
          else newMap[y][x] = '.';
        });
      });
    }
  });

  return boxPositions;
};

process.stdout.write('Part 1...');
process.stdout.write('\n');
const finalBoxPositionsPart1 = part1();
process.stdout.clearLine(0);
process.stdout.cursorTo(0);

const part2 = async () => {
  const extendedMap = (JSON.parse(JSON.stringify(map)) as string[][]).map(
    (row) =>
      row.flatMap((cell) => {
        if (cell === '#') return ['#', '#'];
        if (cell === 'O') return ['[', ']'];
        if (cell === '@') return ['@', '.'];
        return ['.', '.'];
      })
  );
  const newMap = JSON.parse(JSON.stringify(extendedMap)) as string[][];

  const robotPosition = {} as Position;
  let boxPositions = [] as Position[];
  const wallPositions = [] as Position[];

  newMap.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        wallPositions.push({ x, y });
      } else if (cell === '[') {
        boxPositions.push({ x, y });
      } else if (cell === '@') {
        robotPosition.x = x;
        robotPosition.y = y;
      }
    });
  });

  //   log(newMap.map((row) => row.join('')));

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    process.stdout.cursorTo(0, 1);
    log(`Move ${i + 1}/${moves.length}`);
    log(move);
    const moveDirection = { x: 0, y: 0 };
    if (move === '^') moveDirection.y = -1;
    else if (move === 'v') moveDirection.y = 1;
    else if (move === '<') moveDirection.x = -1;
    else if (move === '>') moveDirection.x = 1;

    let nextPositions = [{ ...robotPosition }];
    let nextChars = ['.'];
    const boxesToMove = [] as Position[];
    let foundSpace = false;
    while (!nextChars.includes('#') && !foundSpace) {
      nextPositions = nextPositions.map(({ x, y }) => ({
        x: x + moveDirection.x,
        y: y + moveDirection.y,
      }));
      //   log(nextPositions);
      nextChars = nextPositions.map(({ x, y }) => newMap[y][x]);

      const finalNextPositions = [] as Position[];
      nextChars.forEach((char, index) => {
        if (char === '[') {
          boxesToMove.push({ ...nextPositions[index] });
          finalNextPositions.push({
            ...nextPositions[index],
          });
          if (
            ['^', 'v'].includes(move) &&
            !nextPositions.some(
              ({ x, y }) =>
                x === nextPositions[index].x + 1 && y === nextPositions[index].y
            )
          ) {
            finalNextPositions.push({
              x: nextPositions[index].x + 1,
              y: nextPositions[index].y,
            });
          }
        } else if (char === ']') {
          finalNextPositions.push({
            ...nextPositions[index],
          });
          if (
            ['^', 'v'].includes(move) &&
            !nextPositions.some(
              ({ x, y }) =>
                x === nextPositions[index].x - 1 && y === nextPositions[index].y
            )
          ) {
            const leftBoxEdgePosition = {
              x: nextPositions[index].x - 1,
              y: nextPositions[index].y,
            };
            boxesToMove.push(leftBoxEdgePosition);
            finalNextPositions.push(leftBoxEdgePosition);
          }
        }
      });
      nextPositions = finalNextPositions;

      if (nextChars.every((char) => char === '.')) foundSpace = true;
    }

    if (foundSpace) {
      robotPosition.x += moveDirection.x;
      robotPosition.y += moveDirection.y;

      boxPositions = boxPositions.filter(
        (b) => !boxesToMove.some((box) => box.x === b.x && box.y === b.y)
      );

      boxesToMove.forEach((box) => {
        boxPositions.push({
          x: box.x + moveDirection.x,
          y: box.y + moveDirection.y,
        });
      });

      extendedMap.forEach((row, y) => {
        for (let x = row.length - 1; x >= 0; x--) {
          if (robotPosition.x === x && robotPosition.y === y) {
            newMap[y][x] = '@';
          } else if (boxPositions.some((box) => box.x === x && box.y === y)) {
            newMap[y][x] = '[';
            newMap[y][x + 1] = ']';
          } else if (row[x] === ']') {
            newMap[y][x] = '.';
          } else if (row[x] === '#') newMap[y][x] = '#';
          else newMap[y][x] = '.';
        }
      });
    }
    log(newMap.map((row) => row.join('')));
    // await new Promise((r) => setTimeout(r, 50));
  }

  return boxPositions;
};

process.stdout.cursorTo(0, 0);
process.stdout.write('Part 2...');
process.stdout.write('\n');
const finalBoxPositions2 = await part2();
log(sum(finalBoxPositionsPart1.map((box) => 100 * box.y + box.x)));
log(sum(finalBoxPositions2.map((box) => 100 * box.y + box.x)));
