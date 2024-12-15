import { Position } from './types.ts';
import fs from 'node:fs';

const findPosition = (x: number, y: number, positions: Position[]) =>
  positions.find((position) => position.x === x && position.y === y);

export const writeGridToFile = (
  gridDirectory: string,
  filename: string,
  gridHeight: number,
  gridWidth: number
) => {
  const myConsole = new console.Console(
    fs.createWriteStream(`${gridDirectory}/${filename}.txt`)
  );
  for (let y = 0; y < gridHeight; y++) {
    const line = [] as string[];
    for (let x = 0; x < gridWidth; x++) {
      if (findPosition(x, y, [])) {
        line.push('#');
      } else {
        line.push('.');
      }
    }
    myConsole.log(line.join(''));
  }
};

export const printGridToConsole = async (
  gridHeight: number,
  gridWidth: number,
  positions: Position[]
) => {
  process.stdout.cursorTo(0, 0);
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (findPosition(x, y, positions)) {
        process.stdout.write('\x1b[31m#\x1b[0m');
      } else {
        process.stdout.write('.');
      }
    }
    process.stdout.write('\n');
  }

  await new Promise((r) => setTimeout(r, 100));
};
