import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { Position } from '../../types';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/15/input.txt')
  .join(';')
  .split(';;');

const map = lines[0].split(';').map((row) => row.split(''));
const moves = lines[1].split(';').join('').split('');

const robotPosition = {} as Position;
const boxPositions = [] as Position[];
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
let newBoxes = [...boxPositions];
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

    newBoxes = newBoxes.filter(
      (b) => !boxesToMove.some((box) => box.x === b.x && box.y === b.y)
    );

    boxesToMove.forEach((box) => {
      newBoxes.push({
        x: box.x + moveDirection.x,
        y: box.y + moveDirection.y,
      });
    });

    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (robotPosition.x === x && robotPosition.y === y) newMap[y][x] = '@';
        else if (newBoxes.some((box) => box.x === x && box.y === y))
          newMap[y][x] = 'O';
        else if (cell === '#') newMap[y][x] = '#';
        else newMap[y][x] = '.';
      });
    });
  }
});

process.stdout.clearLine(0);
process.stdout.cursorTo(0);
log(sum(newBoxes.map((box) => 100 * box.y + box.x)));
