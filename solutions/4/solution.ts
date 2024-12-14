import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';

const lines = readLines(path.resolve(), 'solutions/4/input.txt');

const checkArr = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
let xmasCount = 0;

for (let row = 0; row < lines.length; row++) {
  const line = lines[row];
  for (let col = 0; col < line.length; col++) {
    const char = line[col];
    if (char === 'X') {
      for (const [rowAdj, colAdj] of checkArr) {
        if (
          lines[row + rowAdj]?.[col + colAdj] === 'M' &&
          lines[row + 2 * rowAdj]?.[col + 2 * colAdj] === 'A' &&
          lines[row + 3 * rowAdj]?.[col + 3 * colAdj] === 'S'
        ) {
          xmasCount++;
        }
      }
    }
  }
}

log(xmasCount);

let xMasCount = 0;

for (let row = 0; row < lines.length; row++) {
  const line = lines[row];
  for (let col = 0; col < line.length; col++) {
    const char = line[col];
    if (lines[row + 1]?.[col + 1] === 'A') {
      if (char === 'M' && lines[row + 2]?.[col + 2] === 'S') {
        if (
          (lines[row]?.[col + 2] === 'S' && lines[row + 2]?.[col] === 'M') ||
          (lines[row]?.[col + 2] === 'M' && lines[row + 2]?.[col] === 'S')
        ) {
          xMasCount++;
        }
      }
      if (char === 'S' && lines[row + 2]?.[col + 2] === 'M') {
        if (
          (lines[row]?.[col + 2] === 'M' && lines[row + 2]?.[col] === 'S') ||
          (lines[row]?.[col + 2] === 'S' && lines[row + 2]?.[col] === 'M')
        ) {
          xMasCount++;
        }
      }
    }
  }
}

log(xMasCount);
